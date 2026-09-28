import React, { useMemo, useState } from 'react';
import { parseDealerOffer, ParsedField } from './toshiParser';

/* ------------------------------------------------------------------ */
/* shared (ported from toshi src/lib/math.ts and format.ts)            */
/* ------------------------------------------------------------------ */

function pmt(principal: number, aprPercent: number, termMonths: number) {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = aprPercent / 100 / 12;
  if (r === 0) return principal / termMonths;
  const pow = Math.pow(1 + r, termMonths);
  return (principal * r * pow) / (pow - 1);
}

const money = (n: number, cents = false) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: cents ? 2 : 0, minimumFractionDigits: cents ? 2 : 0 });

/* ------------------------------------------------------------------ */
/* quote reader                                                        */
/* ------------------------------------------------------------------ */

const SAMPLES: Record<string, string> = {
  finance: `2026 Honda Accord EX-L
MSRP: $36,450
Selling price: $34,990
Doc fee: $499
Destination: $1,095
Financing 5.90% APR for 72 months
$3,000 down
Est. payment $578/mo
Sales tax 6%`,
  lease: `2026 Toyota RAV4 XLE lease special
MSRP $33,500
36 months, 10,000 miles per year
$399/month plus tax
$2,999 due at signing
Money factor .00210
Residual 62%
Acquisition fee $650`,
  text: `hey! can do the 2026 Chevrolet Tahoe LT at $1,150 a month for 84 months, 7.9% apr with $5,000 down. doc fee is $799 and theres a $1,495 protection package already on it 👍`
};

const MONEY_KEYS = new Set([
  'msrp',
  'sellingPrice',
  'outTheDoor',
  'discount',
  'markup',
  'rebates',
  'destinationCharge',
  'docFee',
  'acquisitionFee',
  'dispositionFee',
  'registrationFee',
  'titleFee',
  'dueAtSigning',
  'downPayment',
  'tradeInValue',
  'tradeInPayoff',
  'monthlyPayment',
  'totalOfPayments',
  'residualValue',
  'buyout',
  'securityDeposit'
]);

function showValue(f: ParsedField): string {
  if (typeof f.value !== 'number') return String(f.value);
  if (f.key === 'apr' || f.key === 'residualPercent') return `${f.value}%`;
  if (f.key === 'salesTax') return f.value <= 20 ? `${f.value}%` : money(f.value);
  if (f.key === 'moneyFactor') return f.value.toFixed(5);
  if (f.key === 'termMonths') return `${f.value} mo`;
  if (f.key === 'annualMileage') return `${f.value.toLocaleString('en-US')} mi/yr`;
  if (MONEY_KEYS.has(f.key)) return money(f.value, f.key === 'monthlyPayment');
  return String(f.value);
}

export const QuoteReader: React.FC = () => {
  const [text, setText] = useState(SAMPLES.finance);
  const result = useMemo(() => parseDealerOffer(text), [text]);

  return (
    <div className="tq">
      <div className="tq__input">
        <div className="tq__chips">
          {Object.keys(SAMPLES).map((k) => (
            <button key={k} type="button" className="t-chip" onClick={() => setText(SAMPLES[k])}>
              {k === 'text' ? 'salesperson text' : `${k} quote`}
            </button>
          ))}
          <button type="button" className="t-chip t-chip--ghost" onClick={() => setText('')}>
            clear
          </button>
        </div>
        <textarea
          className="t-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="dealer quote"
          placeholder="paste anything the dealer sent you"
        />
      </div>
      <div className="tq__out">
        <div className="tq__mode">
          {result.modeHint ? (
            <span className={`t-badge t-badge--${result.modeHint === 'lease' ? 'purple' : 'ink'}`}>{result.modeHint}</span>
          ) : (
            <span className="t-badge t-badge--faint">no deal type yet</span>
          )}
          <span className="tq__count">{result.fields.length} fields read</span>
        </div>
        <ul className="tq__fields">
          {result.fields.map((f) => (
            <li key={f.key} className="tq__field">
              <span className={`tq__conf tq__conf--${f.confidence}`} title={`${f.confidence} confidence`} />
              <span className="tq__label">{f.label}</span>
              <span className="tq__value">{showValue(f)}</span>
              <code className="tq__raw">{f.raw}</code>
            </li>
          ))}
        </ul>
        {result.notes.map((n) => (
          <p key={n} className="tq__note">
            {n}
          </p>
        ))}
        <p className="tq__legend">
          <span className="tq__conf tq__conf--high" /> labeled <span className="tq__conf tq__conf--medium" /> inferred from nearby text
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* payment calculator                                                  */
/* ------------------------------------------------------------------ */

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  show: (n: number) => string;
}> = ({ label, value, min, max, step, onChange, show }) => (
  <label className="t-slider">
    <span className="t-slider__top">
      <span>{label}</span>
      <strong>{show(value)}</strong>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ['--p' as string]: `${((value - min) / (max - min)) * 100}%` }}
    />
  </label>
);

export const PaymentCalculator: React.FC = () => {
  const [price, setPrice] = useState(34990);
  const [down, setDown] = useState(3000);
  const [apr, setApr] = useState(5.9);
  const [term, setTerm] = useState(72);

  const principal = Math.max(0, price - down);
  const monthly = pmt(principal, apr, term);
  const totalPaid = monthly * term;
  const interest = Math.max(0, totalPaid - principal);
  const interestShare = totalPaid > 0 ? interest / totalPaid : 0;

  // balance at the end of each year (for the little chart)
  const years = useMemo(() => {
    const r = apr / 100 / 12;
    const out: number[] = [];
    let bal = principal;
    for (let m = 1; m <= term; m++) {
      const int = bal * r;
      bal = Math.max(0, bal - (monthly - int));
      if (m % 12 === 0 || m === term) out.push(bal);
    }
    return out;
  }, [principal, apr, term, monthly]);

  return (
    <div className="tp">
      <div className="tp__controls">
        <Slider label="Selling price" value={price} min={10000} max={90000} step={250} onChange={setPrice} show={(n) => money(n)} />
        <Slider label="Down payment" value={down} min={0} max={20000} step={250} onChange={setDown} show={(n) => money(n)} />
        <Slider label="APR" value={apr} min={0} max={15} step={0.1} onChange={setApr} show={(n) => `${n.toFixed(1)}%`} />
        <div className="t-seg" role="radiogroup" aria-label="term">
          {[36, 48, 60, 72, 84].map((t) => (
            <button key={t} type="button" role="radio" aria-checked={term === t} className={term === t ? 'is-on' : ''} onClick={() => setTerm(t)}>
              {t} mo
            </button>
          ))}
        </div>
      </div>
      <div className="tp__out">
        <p className="tp__kicker">per month</p>
        <p className="tp__big">{money(monthly, true)}</p>
        <div className="tp__split" aria-hidden>
          <span style={{ width: `${(1 - interestShare) * 100}%` }} className="tp__split-p" />
          <span style={{ width: `${interestShare * 100}%` }} className="tp__split-i" />
        </div>
        <dl className="tp__rows">
          <div>
            <dt>
              <i className="tp__dot tp__dot--p" /> amount financed
            </dt>
            <dd>{money(principal)}</dd>
          </div>
          <div>
            <dt>
              <i className="tp__dot tp__dot--i" /> interest over {term} months
            </dt>
            <dd>{money(interest)}</dd>
          </div>
          <div>
            <dt>total of payments</dt>
            <dd>{money(totalPaid)}</dd>
          </div>
        </dl>
        <div className="tp__bars" aria-label="balance at the end of each year">
          {years.map((b, i) => (
            <div key={i} className="tp__bar">
              <span style={{ height: `${principal > 0 ? Math.max(3, (b / principal) * 100) : 3}%` }} />
              <em>y{i + 1}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* deal score (rules ported from toshi src/lib/analyze.ts)             */
/* ------------------------------------------------------------------ */

type Badge = 'good' | 'normal' | 'expensive' | 'bad';

const badgeFromScore = (s: number): Badge => (s >= 80 ? 'good' : s >= 60 ? 'normal' : s >= 40 ? 'expensive' : 'bad');

function gradeFromScore(score: number) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
}

function scoreDeal(d: { msrp: number; price: number; apr: number; market: number; term: number; doc: number; addons: number }) {
  const factors: { id: string; label: string; score: number; why: string }[] = [];

  const vsMsrp = d.msrp > 0 ? ((d.price - d.msrp) / d.msrp) * 100 : 0;
  let priceScore = 70;
  let priceWhy = 'Price is close to MSRP, which is a typical retail outcome.';
  if (vsMsrp <= -8) {
    priceScore = 98;
    priceWhy = `You're ${Math.abs(vsMsrp).toFixed(1)}% below MSRP (${money(d.msrp - d.price)} off). That is a strong discount for a new vehicle.`;
  } else if (vsMsrp <= -3) {
    priceScore = 88;
    priceWhy = `You're ${Math.abs(vsMsrp).toFixed(1)}% below MSRP. A meaningful discount, especially if inventory is tight.`;
  } else if (vsMsrp < 1) {
    priceScore = 72;
    priceWhy = 'Selling price is near MSRP. Not a steal, not a gouge — negotiate destination, add-ons, and rate next.';
  } else if (vsMsrp < 5) {
    priceScore = 48;
    priceWhy = `You're paying ${vsMsrp.toFixed(1)}% above MSRP (${money(d.price - d.msrp)}). Unless this is a constrained allocation car, that markup is extra dealer profit.`;
  } else {
    priceScore = 25;
    priceWhy = `Markup is ${vsMsrp.toFixed(1)}% of MSRP. You are subsidizing dealer margin on the vehicle price itself.`;
  }
  factors.push({ id: 'price', label: 'Vehicle price vs MSRP', score: priceScore, why: priceWhy });

  const spread = d.apr - d.market;
  let aprScore = 70;
  let aprWhy = `APR is ${d.apr.toFixed(2)}% vs a ${d.market.toFixed(2)}% benchmark.`;
  if (spread <= -0.5) {
    aprScore = 95;
    aprWhy = `Your ${d.apr.toFixed(2)}% APR is better than the ${d.market.toFixed(2)}% market benchmark. Cheap money.`;
  } else if (spread <= 0.5) {
    aprScore = 82;
    aprWhy = `APR of ${d.apr.toFixed(2)}% is in line with the ${d.market.toFixed(2)}% benchmark.`;
  } else if (spread <= 2) {
    aprScore = 50;
    aprWhy = `APR is ${spread.toFixed(1)} points above the ${d.market.toFixed(2)}% benchmark. On this loan that extra rate is expensive interest.`;
  } else {
    aprScore = 28;
    aprWhy = `${d.apr.toFixed(2)}% is far above a ${d.market.toFixed(2)}% market rate. Get a credit union or bank pre-approval before signing.`;
  }
  factors.push({ id: 'apr', label: 'APR vs market', score: aprScore, why: aprWhy });

  const termScore = d.term <= 48 ? 90 : d.term <= 60 ? 78 : d.term <= 72 ? 55 : 32;
  const termWhy =
    d.term >= 72
      ? `${d.term} months stretches the loan so the car depreciates faster than you pay it down. Underwater risk is real.`
      : d.term >= 60
        ? 'A 5-year term is common, but you will still pay a lot of interest in the first half.'
        : 'Shorter terms cost more per month and less overall — usually the healthier structure.';
  factors.push({ id: 'term', label: 'Loan term', score: termScore, why: termWhy });

  const feeScore = d.doc <= 250 ? 92 : d.doc <= 499 ? 75 : d.doc <= 799 ? 48 : 22;
  factors.push({
    id: 'doc',
    label: 'Documentation fee',
    score: feeScore,
    why:
      d.doc > 799
        ? `A ${money(d.doc)} doc fee is a dealer profit center, not a government charge. Many states cap this far lower.`
        : d.doc > 499
          ? `${money(d.doc)} is on the high side of typical doc fees. Ask whether it is required by law in this state (usually it is not).`
          : `${money(d.doc)} is within a normal range for dealer processing.`
  });

  const addonScore = d.addons <= 0 ? 95 : d.addons <= 500 ? 70 : d.addons <= 1500 ? 45 : 20;
  factors.push({
    id: 'addons',
    label: 'Dealer add-ons',
    score: addonScore,
    why:
      d.addons > 1500
        ? `${money(d.addons)} in dealer-installed products is a classic margin pad. Paint, nitrogen, VIN etch, and "security" packages are rarely worth sticker.`
        : d.addons > 0
          ? `${money(d.addons)} in extras. Confirm you asked for each item and know the dealer cost.`
          : 'No dealer products in the deal. That is the cleanest structure.'
  });

  const score = Math.round(factors.reduce((s, f) => s + f.score, 0) / factors.length);
  return { score, grade: gradeFromScore(score), factors };
}

const NumField: React.FC<{ label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number }> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1
}) => (
  <label className="t-field">
    <span>{label}</span>
    <span className="t-field__box">
      {prefix && <i>{prefix}</i>}
      <input type="number" value={value} step={step} min={0} onChange={(e) => onChange(Number(e.target.value) || 0)} />
      {suffix && <i>{suffix}</i>}
    </span>
  </label>
);

export const DealScore: React.FC = () => {
  const [d, setD] = useState({ msrp: 36450, price: 34990, apr: 5.9, market: 6.5, term: 72, doc: 499, addons: 399 });
  const set = (k: keyof typeof d) => (n: number) => setD((cur) => ({ ...cur, [k]: n }));
  const result = useMemo(() => scoreDeal(d), [d]);
  const tone = badgeFromScore(result.score);

  return (
    <div className="ts">
      <div className="ts__inputs">
        <NumField label="MSRP" prefix="$" value={d.msrp} onChange={set('msrp')} step={100} />
        <NumField label="Selling price" prefix="$" value={d.price} onChange={set('price')} step={100} />
        <NumField label="APR" suffix="%" value={d.apr} onChange={set('apr')} step={0.1} />
        <NumField label="Market APR" suffix="%" value={d.market} onChange={set('market')} step={0.1} />
        <NumField label="Term" suffix="mo" value={d.term} onChange={set('term')} step={12} />
        <NumField label="Doc fee" prefix="$" value={d.doc} onChange={set('doc')} step={50} />
        <NumField label="Dealer add-ons" prefix="$" value={d.addons} onChange={set('addons')} step={100} />
      </div>
      <div className="ts__out">
        <div className={`ts__grade ts__grade--${tone}`}>
          <span className="ts__letter">{result.grade}</span>
          <span className="ts__num">{result.score}/100</span>
        </div>
        <ul className="ts__factors">
          {result.factors.map((f) => (
            <li key={f.id}>
              <div className="ts__factor-top">
                <span>{f.label}</span>
                <span className={`t-badge t-badge--${badgeFromScore(f.score)}`}>{badgeFromScore(f.score)}</span>
              </div>
              <p>{f.why}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
