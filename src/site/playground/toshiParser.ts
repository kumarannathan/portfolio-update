// Ported verbatim from toshi (car.com) src/lib/parser.ts — the rules-based pass that
// reads a pasted dealer quote before any AI extraction runs. Types inlined.
/* eslint-disable no-useless-escape */

export type DealMode = 'finance' | 'lease';

export interface ParsedField {
  key: string;
  label: string;
  value: number | string;
  raw: string;
  confidence: 'high' | 'medium' | 'low';
}

interface VehicleInputs {
  year: string;
  make: string;
  model: string;
  trim: string;
}

export interface ParseResult {
  fields: ParsedField[];
  modeHint: DealMode | null;
  vehicleHint: Partial<VehicleInputs>;
  notes: string[];
}

const NUM = String.raw`(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)`
const MONEY = String.raw`\$\s*${NUM}`

type Rule = { re: RegExp; confidence?: ParsedField['confidence']; min?: number; max?: number }

function toNumber(raw: string) {
  const n = parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : NaN
}

/** First rule whose captured number lands inside [min, max] wins. */
function find(text: string, key: string, label: string, rules: Rule[]): ParsedField | null {
  for (const rule of rules) {
    const re = new RegExp(rule.re.source, rule.re.flags.includes('g') ? rule.re.flags : `${rule.re.flags}g`)
    for (const m of Array.from(text.matchAll(re))) {
      const value = toNumber(m[1])
      if (!Number.isFinite(value)) continue
      if (rule.min != null && value < rule.min) continue
      if (rule.max != null && value > rule.max) continue
      return { key, label, value, raw: m[0].replace(/\s+/g, ' ').trim(), confidence: rule.confidence ?? 'high' }
    }
  }
  return null
}

/** Label followed closely by a $ amount, without crossing into another sentence or label. */
function labeled(label: string, opts: Omit<Rule, 're'> & { gap?: number } = {}): Rule {
  const gap = opts.gap ?? 20
  return { ...opts, re: new RegExp(String.raw`\b(?:${label})\b[^$\n.;]{0,${gap}}?[-–:]?\s*${MONEY}`, 'i') }
}

const PRICE = { min: 3000, max: 400000 }
const FEE = { min: 1, max: 5000 }

/** Lines/headers the fetcher adds, which must never be read as deal numbers. */
function stripScaffolding(text: string) {
  return text
    .replace(/^PAGE TITLE\s*$/gim, ' ')
    .replace(/^OG TITLE\s*$/gim, ' ')
    .replace(/^DESCRIPTION\s*$/gim, ' ')
    .replace(/^SOURCE\s*\n\S+/gim, ' ')
    .replace(/^VISIBLE CONTENT\s*$/gim, ' ')
}

const WARRANTY_NOISE = /\b\d{1,3}\s*(?:months?|mos?)\b[^.\n]{0,40}\b(?:warranty|siriusxm|sirius|trial|onstar|maintenance|roadside|coverage|subscription|free|complimentary|connected|data plan|wi-?fi)/gi

export function parseDealerOffer(text: string): ParseResult {
  const src = stripScaffolding(text.replace(/ /g, ' ').replace(/[‐‑–—]/g, '-'))
  const lower = src.toLowerCase()
  const fields: ParsedField[] = []
  const notes: string[] = []
  const add = (f: ParsedField | null) => {
    if (f && !fields.some((x) => x.key === f.key)) fields.push(f)
  }

  // ---- mode ----
  const leaseSignals = (lower.match(/\blease\b|\bleasing\b|money factor|residual|acquisition fee|due at signing|drive[- ]off|miles?\s*(?:per|\/|a)\s*y(?:ea)?r|disposition fee|purchase option|lease[- ]end/g) || []).length
  const financeSignals = (lower.match(/\bapr\b|\bfinanc|\bloan\b|amount financed|\bdown payment\b|\bfor\s+\d{2}\s*(?:mos?|months)\s+at\b/g) || []).length
  const modeHint: DealMode | null = leaseSignals === 0 && financeSignals === 0 ? null : leaseSignals >= financeSignals && leaseSignals > 0 ? 'lease' : 'finance'
  const isLease = modeHint === 'lease'

  // ---- price ----
  add(find(src, 'msrp', 'MSRP', [labeled('msrp|m\\.s\\.r\\.p|sticker price|window sticker|total msrp', PRICE)]))
  add(
    find(src, 'sellingPrice', 'Selling price', [
      labeled('selling price|sale price|sales price|your price|internet price|e-?price|dealer price|negotiated price|agreed(?:[- ]upon)? price|adjusted cap(?:italized)? cost|gross cap(?:italized)? cost|cap(?:italized)? cost|vehicle price|special price|final price|our price|now', PRICE),
      labeled('price', { ...PRICE, confidence: 'medium' }),
    ]),
  )
  add(
    find(src, 'outTheDoor', 'Out-the-door price', [
      labeled('out[- ]the[- ]door(?: price)?|\\botd\\b(?: price)?|total (?:cash )?price(?: with| incl\\.?| including)? (?:tax|taxes|fees)', PRICE),
      { re: new RegExp(`${MONEY}\\s*(?:out[- ]the[- ]door|otd)\\b`, 'i'), ...PRICE },
    ]),
  )
  add(find(src, 'discount', 'Dealer discount', [labeled('dealer discount|discount|savings|you save|off msrp|price reduction', { min: 50, max: 60000 })]))
  add(find(src, 'markup', 'Dealer markup', [labeled('market (?:value )?adjustment|additional dealer markup|dealer markup|markup|\\badm\\b|addendum', { min: 50, max: 100000 })]))
  add(find(src, 'rebates', 'Rebates', [labeled('rebates?|incentives?|bonus cash|customer cash|conquest cash|loyalty(?: cash)?|manufacturer cash|gm (?:rebate|cash)|factory rebate', { min: 50, max: 30000 })]))
  add(find(src, 'destinationCharge', 'Destination', [labeled('destination(?: charge| fee| & handling)?|freight|dest\\.?', { min: 300, max: 3500 })]))

  // ---- fees ----
  add(
    find(src, 'docFee', 'Doc fee', [
      labeled('doc(?:ument(?:ation)?|umentary)? fee|dealer fee|processing fee|admin(?:istrative)? fee|conveyance fee', FEE),
      { re: new RegExp(`${MONEY}\\s*(?:doc(?:ument(?:ation)?|umentary)?|dealer|processing|admin) fee`, 'i'), ...FEE },
    ]),
  )
  add(find(src, 'acquisitionFee', 'Acquisition fee', [labeled('acquisition(?: fee)?|bank fee|lease (?:inception|origination) fee', { min: 100, max: 1500 }), { re: new RegExp(`${MONEY}\\s*acquisition fee`, 'i'), min: 100, max: 1500 }]))
  add(find(src, 'dispositionFee', 'Disposition fee', [labeled('disposition(?: fee)?|turn-?in fee', { min: 100, max: 1500 })]))
  add(find(src, 'registrationFee', 'Registration', [labeled('registration(?: fee)?|reg\\.? fee|license (?:and|&) registration|plates?(?: fee)?', FEE)]))
  add(find(src, 'titleFee', 'Title fee', [labeled('title fee|title & registration|title(?= ?[:$])', { min: 5, max: 1500 })]))
  add(
    find(src, 'salesTax', 'Sales tax', [
      { re: new RegExp(String.raw`\b(?:sales\s*)?tax(?:\s*rate)?\b[^%$\n]{0,12}?${NUM}\s*%`, 'i'), min: 0.5, max: 15 },
      { re: new RegExp(String.raw`${NUM}\s*%\s*(?:sales\s*)?tax`, 'i'), min: 0.5, max: 15 },
      labeled('sales tax|taxes', { min: 50, max: 40000, confidence: 'medium' }),
    ]),
  )

  // ---- money down / due ----
  add(
    find(src, 'dueAtSigning', 'Due at signing', [
      { re: new RegExp(`${MONEY}\\s*(?:total\\s*)?(?:due at (?:lease )?signing|drive[- ]?off|due at delivery|cash due)`, 'i'), min: 0, max: 60000 },
      labeled('due at (?:lease )?signing|total due|drive[- ]?off(?: amount)?|amount due|cash due at signing|due at delivery', { min: 0, max: 60000 }),
    ]),
  )
  add(
    find(src, 'downPayment', isLease ? 'Cap cost reduction' : 'Down payment', [
      labeled('cap(?:italized)? cost reduction|down payment|cash down|money down|customer cash down|with', { min: 0, max: 100000, gap: 8 }),
      { re: new RegExp(`${MONEY}\\s*(?:down|cash down|down payment)\\b`, 'i'), min: 0, max: 100000 },
    ]),
  )
  add(find(src, 'tradeInValue', 'Trade-in value', [labeled('trade[- ]?in(?: value| allowance)?|trade value|trade allowance', { min: 100, max: 150000 })]))
  add(find(src, 'tradeInPayoff', 'Trade payoff', [labeled('trade[- ]?in payoff|payoff|amount owed|lien', { min: 100, max: 150000 })]))

  // ---- rate & term ----
  add(
    find(src, 'apr', 'APR', [
      { re: new RegExp(String.raw`${NUM}\s*%\s*(?:fixed\s*)?a\.?p\.?r`, 'i'), min: 0, max: 30 },
      { re: new RegExp(String.raw`\ba\.?p\.?r\.?\b[^%\n]{0,16}?${NUM}\s*%`, 'i'), min: 0, max: 30 },
      { re: new RegExp(String.raw`(?:financing|finance rate|interest rate|rate)\b[^%\n]{0,12}?${NUM}\s*%`, 'i'), min: 0, max: 30, confidence: 'medium' },
      { re: new RegExp(String.raw`\bat\s+${NUM}\s*%`, 'i'), min: 0, max: 30, confidence: 'medium' },
    ]),
  )
  const termSrc = src.replace(WARRANTY_NOISE, ' ')
  add(
    find(termSrc, 'termMonths', 'Term (months)', [
      { re: /\b(?:term|lease term|loan term|financing term)\b[^0-9\n]{0,12}(\d{2})\s*(?:months?|mos?\.?)?/i, min: 12, max: 96 },
      { re: /\b(\d{2})\s*[- ]?(?:months?|mos?\.?)\s*(?:lease|loan|term|financing|at\b|@)/i, min: 12, max: 96 },
      { re: /\b(?:for|x|×|over)\s*(\d{2})\s*(?:months?|mos?\.?)\b/i, min: 12, max: 96 },
      { re: /\b(\d{2})\s*(?:months?|mos?\.?)\b/i, min: 24, max: 96, confidence: 'medium' },
    ]),
  )

  // ---- monthly payment (skip "total of monthly payments") ----
  const paySrc = src.replace(/total of (?:all )?(?:monthly )?payments?[^$\d]{0,12}\$?\s*[\d,.]+/gi, ' ')
  add(
    find(paySrc, 'monthlyPayment', 'Monthly payment', [
      labeled('monthly payment|est(?:imated)?\\.? payment|payment(?: of)?|lease (?:for|payment)|per month', { min: 50, max: 5000 }),
      { re: new RegExp(`${MONEY}\\s*(?:\\/\\s*mo(?:nth)?\\b|per\\s*mo(?:nth)?\\b|a\\s*month|monthly|\\/month|mo\\.)`, 'i'), min: 50, max: 5000 },
    ]),
  )
  add(find(src, 'totalOfPayments', 'Total of payments', [labeled('total of (?:all )?(?:monthly )?payments?', { min: 500, max: 300000 })]))

  // ---- lease specifics ----
  add(
    find(src, 'annualMileage', 'Annual mileage', [
      { re: /(\d{1,2},?\d{3})\s*(?:miles?|mi\.?)\s*(?:per|\/|a|each)\s*(?:year|yr)/i, min: 5000, max: 30000 },
      { re: /\b(?:annual mileage|miles\/yr|mileage allowance|miles per year)\b[^0-9\n]{0,10}(\d{1,2},?\d{3})/i, min: 5000, max: 30000 },
      { re: /(\d{1,2})k\s*(?:miles?|mi)\s*(?:per|\/|a)\s*(?:year|yr)/i, min: 5, max: 30 },
    ]),
  )
  add(
    find(src, 'residualPercent', 'Residual %', [
      { re: new RegExp(String.raw`\bresidual(?: value)?\b[^%$\n]{0,16}?${NUM}\s*%`, 'i'), min: 20, max: 90 },
      { re: new RegExp(String.raw`${NUM}\s*%\s*residual`, 'i'), min: 20, max: 90 },
    ]),
  )
  add(
    find(src, 'residualValue', 'Residual $', [
      labeled('residual(?: value| amount)?', { min: 3000, max: 300000, gap: 24 }),
      { re: new RegExp(String.raw`\bresidual[^$\n]{0,24}\(\s*${MONEY}\s*\)`, 'i'), min: 3000, max: 300000 },
    ]),
  )
  add(
    find(src, 'moneyFactor', 'Money factor', [
      { re: /\b(?:money factor|\bmf\b|lease factor|lease rate factor)\b[^0-9\n]{0,12}(0?\.\d{3,6})/i, min: 0.00001, max: 0.01 },
      { re: /\b(?:money factor|\bmf\b)\b[^0-9\n]{0,12}(\d(?:\.\d+)?)\b/i, min: 0.3, max: 9, confidence: 'medium' },
    ]),
  )
  add(find(src, 'buyout', 'Buyout', [labeled('buyout|purchase option(?: price)?|option to purchase(?: at lease end)?|lease[- ]end purchase', { min: 3000, max: 300000, gap: 28 })]))
  add(find(src, 'securityDeposit', 'Security deposit', [labeled('security deposit', { min: 0, max: 5000 })]))

  // Lease MF written as "2.35" (×1000) → 0.00235
  const mfField = fields.find((f) => f.key === 'moneyFactor')
  if (mfField && typeof mfField.value === 'number' && mfField.value >= 0.3) mfField.value = mfField.value / 1000

  // ---- vehicle ----
  const vehicle = src.match(/\b(20[1-3]\d)\s+(Acura|Alfa Romeo|Audi|BMW|Buick|Cadillac|Chevrolet|Chevy|Chrysler|Dodge|Fiat|Ford|Genesis|GMC|Honda|Hyundai|Infiniti|Jaguar|Jeep|Kia|Land Rover|Lexus|Lincoln|Lucid|Mazda|Mercedes-Benz|Mercedes|Mini|MINI|Mitsubishi|Nissan|Polestar|Porsche|Ram|Rivian|Subaru|Tesla|Toyota|Volkswagen|VW|Volvo|[A-Z][a-zA-Z]+)\s+([A-Z0-9][\w-]*)(?:\s+([A-Z0-9][\w-]*))?/)
  const vehicleHint: Partial<VehicleInputs> = {}
  if (vehicle) {
    const trimWord = vehicle[4] && !/^(for|lease|with|crew|cab|sale|in|at|4wd|awd|fwd|rwd|new|used)$/i.test(vehicle[4]) ? vehicle[4] : undefined
    vehicleHint.year = vehicle[1]
    vehicleHint.make = vehicle[2]
    vehicleHint.model = vehicle[3]
    if (trimWord) vehicleHint.trim = trimWord
    fields.unshift({ key: 'vehicle', label: 'Vehicle', value: [vehicle[1], vehicle[2], vehicle[3], trimWord].filter(Boolean).join(' '), raw: vehicle[0], confidence: 'medium' })
  }

  // ---- sanity ----
  const msrp = fields.find((f) => f.key === 'msrp')?.value
  const selling = fields.find((f) => f.key === 'sellingPrice')
  if (typeof msrp === 'number' && selling && typeof selling.value === 'number' && (selling.value < msrp * 0.5 || selling.value > msrp * 1.5)) {
    fields.splice(fields.indexOf(selling), 1)
    notes.push('Found a "price" that did not look like the vehicle price, so it was left out.')
  }

  if (fields.length <= 1) notes.push('Very little was recognized. Paste the full quote with labels such as MSRP, APR, term and monthly payment, or upload a screenshot.')

  return { fields, modeHint, vehicleHint, notes }
}

