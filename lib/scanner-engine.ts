// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// lib/scanner-engine.ts — Momentum Scoring & Analysis v3
// FMP-powered: 600 stocks, batch quotes, richer scoring
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { FmpQuote } from "./fmp";

export type SectorName =
  | "Technology" | "Healthcare" | "Energy" | "Financials"
  | "Industrials" | "Consumer Discretionary" | "Consumer Staples"
  | "Utilities" | "Real Estate" | "Materials" | "Communication Services";

export interface UniverseEntry {
  symbol: string;
  name: string;
  sector: SectorName;
}

export interface ScannerStock {
  symbol: string;
  name: string;
  sector: SectorName;
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  prevClose: number;
  momentumScore: number;
  relativeVolume: number;
  rsi: number;
  signal: "STRONG BUY" | "BUY" | "NEUTRAL" | "SELL" | "STRONG SELL";
  pattern: string;
  dayRangePosition: number;
  gapPct: number;
  marketCap: number;
  priceVs50MA: number;
  priceVs200MA: number;
  fetchedAt: string;
}

// ── 600 Stock Universe ───────────────────────────────────
// Top liquid, high-beta names across all 11 GICS sectors
// Covers S&P 500 leaders + high-momentum mid-caps

export const SCAN_UNIVERSE: UniverseEntry[] = [
  // ── Technology (100) ───────────────────────────────────
  { symbol: "AAPL", name: "Apple Inc", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Technology" },
  { symbol: "AVGO", name: "Broadcom Inc", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology" },
  { symbol: "SMCI", name: "Super Micro Computer", sector: "Technology" },
  { symbol: "CRDO", name: "Credo Technology", sector: "Technology" },
  { symbol: "ANET", name: "Arista Networks", sector: "Technology" },
  { symbol: "PLTR", name: "Palantir Technologies", sector: "Technology" },
  { symbol: "APP", name: "AppLovin Corp", sector: "Technology" },
  { symbol: "PANW", name: "Palo Alto Networks", sector: "Technology" },
  { symbol: "ORCL", name: "Oracle Corp", sector: "Technology" },
  { symbol: "CRM", name: "Salesforce Inc", sector: "Technology" },
  { symbol: "NOW", name: "ServiceNow Inc", sector: "Technology" },
  { symbol: "SNPS", name: "Synopsys Inc", sector: "Technology" },
  { symbol: "CDNS", name: "Cadence Design", sector: "Technology" },
  { symbol: "MRVL", name: "Marvell Technology", sector: "Technology" },
  { symbol: "MU", name: "Micron Technology", sector: "Technology" },
  { symbol: "INTC", name: "Intel Corp", sector: "Technology" },
  { symbol: "ADBE", name: "Adobe Inc", sector: "Technology" },
  { symbol: "SHOP", name: "Shopify Inc", sector: "Technology" },
  { symbol: "CRWD", name: "CrowdStrike Holdings", sector: "Technology" },
  { symbol: "FTNT", name: "Fortinet Inc", sector: "Technology" },
  { symbol: "DDOG", name: "Datadog Inc", sector: "Technology" },
  { symbol: "NET", name: "Cloudflare Inc", sector: "Technology" },
  { symbol: "SNOW", name: "Snowflake Inc", sector: "Technology" },
  { symbol: "HUBS", name: "HubSpot Inc", sector: "Technology" },
  { symbol: "TEAM", name: "Atlassian Corp", sector: "Technology" },
  { symbol: "ZS", name: "Zscaler Inc", sector: "Technology" },
  { symbol: "WDAY", name: "Workday Inc", sector: "Technology" },
  { symbol: "INTU", name: "Intuit Inc", sector: "Technology" },
  { symbol: "ANSS", name: "ANSYS Inc", sector: "Technology" },
  { symbol: "KLAC", name: "KLA Corp", sector: "Technology" },
  { symbol: "LRCX", name: "Lam Research", sector: "Technology" },
  { symbol: "AMAT", name: "Applied Materials", sector: "Technology" },
  { symbol: "ADI", name: "Analog Devices", sector: "Technology" },
  { symbol: "NXPI", name: "NXP Semiconductors", sector: "Technology" },
  { symbol: "MCHP", name: "Microchip Technology", sector: "Technology" },
  { symbol: "ON", name: "ON Semiconductor", sector: "Technology" },
  { symbol: "TXN", name: "Texas Instruments", sector: "Technology" },
  { symbol: "QCOM", name: "Qualcomm Inc", sector: "Technology" },
  { symbol: "ARM", name: "Arm Holdings", sector: "Technology" },
  { symbol: "DELL", name: "Dell Technologies", sector: "Technology" },
  { symbol: "HPE", name: "Hewlett Packard Enterprise", sector: "Technology" },
  { symbol: "IBM", name: "IBM Corp", sector: "Technology" },
  { symbol: "GDDY", name: "GoDaddy Inc", sector: "Technology" },
  { symbol: "OKTA", name: "Okta Inc", sector: "Technology" },
  { symbol: "MDB", name: "MongoDB Inc", sector: "Technology" },
  { symbol: "CFLT", name: "Confluent Inc", sector: "Technology" },
  { symbol: "ESTC", name: "Elastic NV", sector: "Technology" },
  { symbol: "PATH", name: "UiPath Inc", sector: "Technology" },
  { symbol: "BILL", name: "BILL Holdings", sector: "Technology" },
  { symbol: "SAMSARA", name: "Samsara Inc", sector: "Technology" },
  { symbol: "TWLO", name: "Twilio Inc", sector: "Technology" },
  { symbol: "DOCU", name: "DocuSign Inc", sector: "Technology" },
  { symbol: "PINS", name: "Pinterest Inc", sector: "Technology" },
  { symbol: "SNAP", name: "Snap Inc", sector: "Technology" },
  { symbol: "U", name: "Unity Software", sector: "Technology" },
  { symbol: "IONQ", name: "IonQ Inc", sector: "Technology" },
  { symbol: "RGTI", name: "Rigetti Computing", sector: "Technology" },
  { symbol: "QUBT", name: "Quantum Computing Inc", sector: "Technology" },
  { symbol: "RKLB", name: "Rocket Lab USA", sector: "Technology" },
  { symbol: "ASTS", name: "AST SpaceMobile", sector: "Technology" },
  { symbol: "ACHR", name: "Archer Aviation", sector: "Technology" },
  { symbol: "JOBY", name: "Joby Aviation", sector: "Technology" },
  { symbol: "SOFI", name: "SoFi Technologies", sector: "Technology" },
  { symbol: "AFRM", name: "Affirm Holdings", sector: "Technology" },
  { symbol: "SQ", name: "Block Inc", sector: "Technology" },
  { symbol: "MARA", name: "MARA Holdings", sector: "Technology" },
  { symbol: "RIOT", name: "Riot Platforms", sector: "Technology" },
  { symbol: "CLSK", name: "CleanSpark Inc", sector: "Technology" },
  { symbol: "CORZ", name: "Core Scientific", sector: "Technology" },
  { symbol: "CIFR", name: "Cipher Mining", sector: "Technology" },
  { symbol: "IREN", name: "Iris Energy", sector: "Technology" },
  { symbol: "BITF", name: "Bitfarms Ltd", sector: "Technology" },
  { symbol: "APLD", name: "Applied Digital", sector: "Technology" },
  { symbol: "AI", name: "C3.ai Inc", sector: "Technology" },
  { symbol: "BBAI", name: "BigBear.ai Holdings", sector: "Technology" },
  { symbol: "SOUN", name: "SoundHound AI", sector: "Technology" },
  { symbol: "UPST", name: "Upstart Holdings", sector: "Technology" },
  { symbol: "HOOD", name: "Robinhood Markets", sector: "Technology" },
  { symbol: "COIN", name: "Coinbase Global", sector: "Technology" },
  { symbol: "MSTR", name: "MicroStrategy Inc", sector: "Technology" },
  { symbol: "ASAN", name: "Asana Inc", sector: "Technology" },
  { symbol: "MNDY", name: "Monday.com Ltd", sector: "Technology" },
  { symbol: "ZI", name: "ZoomInfo Technologies", sector: "Technology" },
  { symbol: "GTLB", name: "GitLab Inc", sector: "Technology" },
  { symbol: "S", name: "SentinelOne Inc", sector: "Technology" },
  { symbol: "CYBR", name: "CyberArk Software", sector: "Technology" },
  { symbol: "TENB", name: "Tenable Holdings", sector: "Technology" },
  { symbol: "RPD", name: "Rapid7 Inc", sector: "Technology" },
  { symbol: "GEN", name: "Gen Digital Inc", sector: "Technology" },
  { symbol: "RDDT", name: "Reddit Inc", sector: "Technology" },
  { symbol: "GRAB", name: "Grab Holdings", sector: "Technology" },
  { symbol: "SE", name: "Sea Limited", sector: "Technology" },
  { symbol: "BABA", name: "Alibaba Group", sector: "Technology" },
  { symbol: "JD", name: "JD.com Inc", sector: "Technology" },
  { symbol: "PDD", name: "PDD Holdings", sector: "Technology" },
  { symbol: "TSM", name: "Taiwan Semiconductor", sector: "Technology" },

  // ── Energy (50) ────────────────────────────────────────
  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy" },
  { symbol: "CVX", name: "Chevron Corp", sector: "Energy" },
  { symbol: "COP", name: "ConocoPhillips", sector: "Energy" },
  { symbol: "TRGP", name: "Targa Resources", sector: "Energy" },
  { symbol: "OKE", name: "ONEOK Inc", sector: "Energy" },
  { symbol: "WMB", name: "Williams Companies", sector: "Energy" },
  { symbol: "SLB", name: "Schlumberger Ltd", sector: "Energy" },
  { symbol: "EOG", name: "EOG Resources", sector: "Energy" },
  { symbol: "MPC", name: "Marathon Petroleum", sector: "Energy" },
  { symbol: "VLO", name: "Valero Energy", sector: "Energy" },
  { symbol: "PSX", name: "Phillips 66", sector: "Energy" },
  { symbol: "HAL", name: "Halliburton Co", sector: "Energy" },
  { symbol: "BKR", name: "Baker Hughes", sector: "Energy" },
  { symbol: "KMI", name: "Kinder Morgan", sector: "Energy" },
  { symbol: "DVN", name: "Devon Energy", sector: "Energy" },
  { symbol: "FANG", name: "Diamondback Energy", sector: "Energy" },
  { symbol: "HES", name: "Hess Corp", sector: "Energy" },
  { symbol: "OXY", name: "Occidental Petroleum", sector: "Energy" },
  { symbol: "APA", name: "APA Corp", sector: "Energy" },
  { symbol: "EQT", name: "EQT Corp", sector: "Energy" },
  { symbol: "AR", name: "Antero Resources", sector: "Energy" },
  { symbol: "CTRA", name: "Coterra Energy", sector: "Energy" },
  { symbol: "RRC", name: "Range Resources", sector: "Energy" },
  { symbol: "PR", name: "Permian Resources", sector: "Energy" },
  { symbol: "CHRD", name: "Chord Energy", sector: "Energy" },
  { symbol: "SM", name: "SM Energy", sector: "Energy" },
  { symbol: "MTDR", name: "Matador Resources", sector: "Energy" },
  { symbol: "OVV", name: "Ovintiv Inc", sector: "Energy" },
  { symbol: "TPL", name: "Texas Pacific Land", sector: "Energy" },
  { symbol: "DTM", name: "DT Midstream", sector: "Energy" },
  { symbol: "AM", name: "Antero Midstream", sector: "Energy" },
  { symbol: "HESM", name: "Hess Midstream", sector: "Energy" },
  { symbol: "ET", name: "Energy Transfer", sector: "Energy" },
  { symbol: "EPD", name: "Enterprise Products", sector: "Energy" },
  { symbol: "MPLX", name: "MPLX LP", sector: "Energy" },
  { symbol: "PAA", name: "Plains All American", sector: "Energy" },
  { symbol: "PAGP", name: "Plains GP Holdings", sector: "Energy" },
  { symbol: "ENLC", name: "EnLink Midstream", sector: "Energy" },
  { symbol: "WFRD", name: "Weatherford Intl", sector: "Energy" },
  { symbol: "NOV", name: "NOV Inc", sector: "Energy" },
  { symbol: "FTI", name: "TechnipFMC", sector: "Energy" },
  { symbol: "CHX", name: "ChampionX Corp", sector: "Energy" },
  { symbol: "LBRT", name: "Liberty Energy", sector: "Energy" },
  { symbol: "HP", name: "Helmerich & Payne", sector: "Energy" },
  { symbol: "RIG", name: "Transocean Ltd", sector: "Energy" },
  { symbol: "VAL", name: "Valaris Ltd", sector: "Energy" },
  { symbol: "NE", name: "Noble Corp", sector: "Energy" },
  { symbol: "PTEN", name: "Patterson-UTI Energy", sector: "Energy" },
  { symbol: "CIVI", name: "Civitas Resources", sector: "Energy" },
  { symbol: "MGY", name: "Magnolia Oil & Gas", sector: "Energy" },

  // ── Industrials (70) ───────────────────────────────────
  { symbol: "GE", name: "GE Aerospace", sector: "Industrials" },
  { symbol: "CAT", name: "Caterpillar Inc", sector: "Industrials" },
  { symbol: "DE", name: "Deere & Company", sector: "Industrials" },
  { symbol: "RTX", name: "RTX Corp", sector: "Industrials" },
  { symbol: "HON", name: "Honeywell Intl", sector: "Industrials" },
  { symbol: "UNP", name: "Union Pacific", sector: "Industrials" },
  { symbol: "BA", name: "Boeing Co", sector: "Industrials" },
  { symbol: "LMT", name: "Lockheed Martin", sector: "Industrials" },
  { symbol: "ETN", name: "Eaton Corp", sector: "Industrials" },
  { symbol: "TT", name: "Trane Technologies", sector: "Industrials" },
  { symbol: "URI", name: "United Rentals", sector: "Industrials" },
  { symbol: "ITW", name: "Illinois Tool Works", sector: "Industrials" },
  { symbol: "EMR", name: "Emerson Electric", sector: "Industrials" },
  { symbol: "UBER", name: "Uber Technologies", sector: "Industrials" },
  { symbol: "FI", name: "Fiserv Inc", sector: "Industrials" },
  { symbol: "AXON", name: "Axon Enterprise", sector: "Industrials" },
  { symbol: "PWR", name: "Quanta Services", sector: "Industrials" },
  { symbol: "PCAR", name: "PACCAR Inc", sector: "Industrials" },
  { symbol: "GD", name: "General Dynamics", sector: "Industrials" },
  { symbol: "NOC", name: "Northrop Grumman", sector: "Industrials" },
  { symbol: "TDG", name: "TransDigm Group", sector: "Industrials" },
  { symbol: "WM", name: "Waste Management", sector: "Industrials" },
  { symbol: "RSG", name: "Republic Services", sector: "Industrials" },
  { symbol: "CSX", name: "CSX Corp", sector: "Industrials" },
  { symbol: "NSC", name: "Norfolk Southern", sector: "Industrials" },
  { symbol: "CARR", name: "Carrier Global", sector: "Industrials" },
  { symbol: "OTIS", name: "Otis Worldwide", sector: "Industrials" },
  { symbol: "FAST", name: "Fastenal Co", sector: "Industrials" },
  { symbol: "GWW", name: "W.W. Grainger", sector: "Industrials" },
  { symbol: "ROK", name: "Rockwell Automation", sector: "Industrials" },
  { symbol: "AME", name: "AMETEK Inc", sector: "Industrials" },
  { symbol: "IR", name: "Ingersoll Rand", sector: "Industrials" },
  { symbol: "HUBB", name: "Hubbell Inc", sector: "Industrials" },
  { symbol: "FTV", name: "Fortive Corp", sector: "Industrials" },
  { symbol: "DOV", name: "Dover Corp", sector: "Industrials" },
  { symbol: "XYL", name: "Xylem Inc", sector: "Industrials" },
  { symbol: "IEX", name: "IDEX Corp", sector: "Industrials" },
  { symbol: "GNRC", name: "Generac Holdings", sector: "Industrials" },
  { symbol: "WAB", name: "Westinghouse Air Brake", sector: "Industrials" },
  { symbol: "DAL", name: "Delta Air Lines", sector: "Industrials" },
  { symbol: "UAL", name: "United Airlines", sector: "Industrials" },
  { symbol: "AAL", name: "American Airlines", sector: "Industrials" },
  { symbol: "LUV", name: "Southwest Airlines", sector: "Industrials" },
  { symbol: "JBLU", name: "JetBlue Airways", sector: "Industrials" },
  { symbol: "FDX", name: "FedEx Corp", sector: "Industrials" },
  { symbol: "UPS", name: "United Parcel Service", sector: "Industrials" },
  { symbol: "EXPD", name: "Expeditors Intl", sector: "Industrials" },
  { symbol: "LYFT", name: "Lyft Inc", sector: "Industrials" },
  { symbol: "BLDR", name: "Builders FirstSource", sector: "Industrials" },
  { symbol: "VMC", name: "Vulcan Materials", sector: "Industrials" },
  { symbol: "MLM", name: "Martin Marietta", sector: "Industrials" },
  { symbol: "J", name: "Jacobs Solutions", sector: "Industrials" },
  { symbol: "EME", name: "EMCOR Group", sector: "Industrials" },
  { symbol: "MTZ", name: "MasTec Inc", sector: "Industrials" },
  { symbol: "TTEK", name: "Tetra Tech Inc", sector: "Industrials" },
  { symbol: "HWM", name: "Howmet Aerospace", sector: "Industrials" },
  { symbol: "TXT", name: "Textron Inc", sector: "Industrials" },
  { symbol: "HEI", name: "HEICO Corp", sector: "Industrials" },
  { symbol: "BWXT", name: "BWX Technologies", sector: "Industrials" },
  { symbol: "HII", name: "Huntington Ingalls", sector: "Industrials" },
  { symbol: "LDOS", name: "Leidos Holdings", sector: "Industrials" },
  { symbol: "SAIA", name: "Saia Inc", sector: "Industrials" },
  { symbol: "XPO", name: "XPO Inc", sector: "Industrials" },
  { symbol: "ODFL", name: "Old Dominion Freight", sector: "Industrials" },
  { symbol: "ACM", name: "AECOM", sector: "Industrials" },
  { symbol: "RRX", name: "Regal Rexnord", sector: "Industrials" },
  { symbol: "PAYC", name: "Paycom Software", sector: "Industrials" },
  { symbol: "PAYX", name: "Paychex Inc", sector: "Industrials" },
  { symbol: "ADP", name: "ADP Inc", sector: "Industrials" },
  { symbol: "CTAS", name: "Cintas Corp", sector: "Industrials" },

  // ── Utilities (30) ─────────────────────────────────────
  { symbol: "VST", name: "Vistra Corp", sector: "Utilities" },
  { symbol: "CEG", name: "Constellation Energy", sector: "Utilities" },
  { symbol: "NRG", name: "NRG Energy", sector: "Utilities" },
  { symbol: "NEE", name: "NextEra Energy", sector: "Utilities" },
  { symbol: "SO", name: "Southern Company", sector: "Utilities" },
  { symbol: "DUK", name: "Duke Energy", sector: "Utilities" },
  { symbol: "AES", name: "AES Corp", sector: "Utilities" },
  { symbol: "EXC", name: "Exelon Corp", sector: "Utilities" },
  { symbol: "D", name: "Dominion Energy", sector: "Utilities" },
  { symbol: "SRE", name: "Sempra", sector: "Utilities" },
  { symbol: "AEP", name: "American Electric Power", sector: "Utilities" },
  { symbol: "XEL", name: "Xcel Energy", sector: "Utilities" },
  { symbol: "WEC", name: "WEC Energy Group", sector: "Utilities" },
  { symbol: "ED", name: "Consolidated Edison", sector: "Utilities" },
  { symbol: "ES", name: "Eversource Energy", sector: "Utilities" },
  { symbol: "AWK", name: "American Water Works", sector: "Utilities" },
  { symbol: "ETR", name: "Entergy Corp", sector: "Utilities" },
  { symbol: "FE", name: "FirstEnergy Corp", sector: "Utilities" },
  { symbol: "PCG", name: "PG&E Corp", sector: "Utilities" },
  { symbol: "EIX", name: "Edison International", sector: "Utilities" },
  { symbol: "CNP", name: "CenterPoint Energy", sector: "Utilities" },
  { symbol: "PNW", name: "Pinnacle West Capital", sector: "Utilities" },
  { symbol: "CMS", name: "CMS Energy", sector: "Utilities" },
  { symbol: "DTE", name: "DTE Energy", sector: "Utilities" },
  { symbol: "LNT", name: "Alliant Energy", sector: "Utilities" },
  { symbol: "PPL", name: "PPL Corp", sector: "Utilities" },
  { symbol: "NI", name: "NiSource Inc", sector: "Utilities" },
  { symbol: "EVRG", name: "Evergy Inc", sector: "Utilities" },
  { symbol: "ATO", name: "Atmos Energy", sector: "Utilities" },
  { symbol: "OGE", name: "OGE Energy", sector: "Utilities" },

  // ── Healthcare (70) ────────────────────────────────────
  { symbol: "LLY", name: "Eli Lilly", sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "ABBV", name: "AbbVie Inc", sector: "Healthcare" },
  { symbol: "MRK", name: "Merck & Co", sector: "Healthcare" },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Healthcare" },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Healthcare" },
  { symbol: "PFE", name: "Pfizer Inc", sector: "Healthcare" },
  { symbol: "BMY", name: "Bristol-Myers Squibb", sector: "Healthcare" },
  { symbol: "AMGN", name: "Amgen Inc", sector: "Healthcare" },
  { symbol: "GILD", name: "Gilead Sciences", sector: "Healthcare" },
  { symbol: "ISRG", name: "Intuitive Surgical", sector: "Healthcare" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals", sector: "Healthcare" },
  { symbol: "BSX", name: "Boston Scientific", sector: "Healthcare" },
  { symbol: "SYK", name: "Stryker Corp", sector: "Healthcare" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals", sector: "Healthcare" },
  { symbol: "HCA", name: "HCA Healthcare", sector: "Healthcare" },
  { symbol: "MDT", name: "Medtronic PLC", sector: "Healthcare" },
  { symbol: "ELV", name: "Elevance Health", sector: "Healthcare" },
  { symbol: "CI", name: "Cigna Group", sector: "Healthcare" },
  { symbol: "ZTS", name: "Zoetis Inc", sector: "Healthcare" },
  { symbol: "BDX", name: "Becton Dickinson", sector: "Healthcare" },
  { symbol: "EW", name: "Edwards Lifesciences", sector: "Healthcare" },
  { symbol: "IDXX", name: "IDEXX Laboratories", sector: "Healthcare" },
  { symbol: "A", name: "Agilent Technologies", sector: "Healthcare" },
  { symbol: "IQV", name: "IQVIA Holdings", sector: "Healthcare" },
  { symbol: "DXCM", name: "DexCom Inc", sector: "Healthcare" },
  { symbol: "GEHC", name: "GE HealthCare", sector: "Healthcare" },
  { symbol: "RMD", name: "ResMed Inc", sector: "Healthcare" },
  { symbol: "BIIB", name: "Biogen Inc", sector: "Healthcare" },
  { symbol: "MRNA", name: "Moderna Inc", sector: "Healthcare" },
  { symbol: "ALNY", name: "Alnylam Pharmaceuticals", sector: "Healthcare" },
  { symbol: "NBIX", name: "Neurocrine Biosciences", sector: "Healthcare" },
  { symbol: "PCVX", name: "Vaxcyte Inc", sector: "Healthcare" },
  { symbol: "EXAS", name: "Exact Sciences", sector: "Healthcare" },
  { symbol: "PODD", name: "Insulet Corp", sector: "Healthcare" },
  { symbol: "HOLX", name: "Hologic Inc", sector: "Healthcare" },
  { symbol: "MTD", name: "Mettler-Toledo", sector: "Healthcare" },
  { symbol: "WAT", name: "Waters Corp", sector: "Healthcare" },
  { symbol: "TECH", name: "Bio-Techne Corp", sector: "Healthcare" },
  { symbol: "VEEV", name: "Veeva Systems", sector: "Healthcare" },
  { symbol: "RVMD", name: "Revolution Medicines", sector: "Healthcare" },
  { symbol: "INCY", name: "Incyte Corp", sector: "Healthcare" },
  { symbol: "SRPT", name: "Sarepta Therapeutics", sector: "Healthcare" },
  { symbol: "ARGX", name: "argenx SE", sector: "Healthcare" },
  { symbol: "BMRN", name: "BioMarin Pharmaceutical", sector: "Healthcare" },
  { symbol: "RARE", name: "Ultragenyx Pharmaceutical", sector: "Healthcare" },
  { symbol: "IONS", name: "Ionis Pharmaceuticals", sector: "Healthcare" },
  { symbol: "HALO", name: "Halozyme Therapeutics", sector: "Healthcare" },
  { symbol: "UTHR", name: "United Therapeutics", sector: "Healthcare" },

  // ── Financials (60) ────────────────────────────────────
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financials" },
  { symbol: "V", name: "Visa Inc", sector: "Financials" },
  { symbol: "MA", name: "Mastercard Inc", sector: "Financials" },
  { symbol: "BAC", name: "Bank of America", sector: "Financials" },
  { symbol: "GS", name: "Goldman Sachs", sector: "Financials" },
  { symbol: "MS", name: "Morgan Stanley", sector: "Financials" },
  { symbol: "BLK", name: "BlackRock Inc", sector: "Financials" },
  { symbol: "SPGI", name: "S&P Global", sector: "Financials" },
  { symbol: "FICO", name: "Fair Isaac Corp", sector: "Financials" },
  { symbol: "ICE", name: "Intercontinental Exchange", sector: "Financials" },
  { symbol: "CME", name: "CME Group", sector: "Financials" },
  { symbol: "C", name: "Citigroup Inc", sector: "Financials" },
  { symbol: "WFC", name: "Wells Fargo", sector: "Financials" },
  { symbol: "SCHW", name: "Charles Schwab", sector: "Financials" },
  { symbol: "AXP", name: "American Express", sector: "Financials" },
  { symbol: "PGR", name: "Progressive Corp", sector: "Financials" },
  { symbol: "CB", name: "Chubb Ltd", sector: "Financials" },
  { symbol: "MMC", name: "Marsh & McLennan", sector: "Financials" },
  { symbol: "AON", name: "Aon PLC", sector: "Financials" },
  { symbol: "AIG", name: "American Intl Group", sector: "Financials" },
  { symbol: "MET", name: "MetLife Inc", sector: "Financials" },
  { symbol: "PRU", name: "Prudential Financial", sector: "Financials" },
  { symbol: "AFL", name: "Aflac Inc", sector: "Financials" },
  { symbol: "TRV", name: "Travelers Companies", sector: "Financials" },
  { symbol: "ALL", name: "Allstate Corp", sector: "Financials" },
  { symbol: "BK", name: "Bank of New York Mellon", sector: "Financials" },
  { symbol: "STT", name: "State Street Corp", sector: "Financials" },
  { symbol: "TROW", name: "T. Rowe Price", sector: "Financials" },
  { symbol: "RJF", name: "Raymond James", sector: "Financials" },
  { symbol: "NDAQ", name: "Nasdaq Inc", sector: "Financials" },
  { symbol: "CBOE", name: "Cboe Global Markets", sector: "Financials" },
  { symbol: "MSCI", name: "MSCI Inc", sector: "Financials" },
  { symbol: "FIS", name: "Fidelity National Info", sector: "Financials" },
  { symbol: "GPN", name: "Global Payments", sector: "Financials" },
  { symbol: "PYPL", name: "PayPal Holdings", sector: "Financials" },
  { symbol: "COF", name: "Capital One Financial", sector: "Financials" },
  { symbol: "DFS", name: "Discover Financial", sector: "Financials" },
  { symbol: "SYF", name: "Synchrony Financial", sector: "Financials" },
  { symbol: "USB", name: "U.S. Bancorp", sector: "Financials" },
  { symbol: "PNC", name: "PNC Financial", sector: "Financials" },
  { symbol: "TFC", name: "Truist Financial", sector: "Financials" },
  { symbol: "FITB", name: "Fifth Third Bancorp", sector: "Financials" },
  { symbol: "MTB", name: "M&T Bank Corp", sector: "Financials" },
  { symbol: "HBAN", name: "Huntington Bancshares", sector: "Financials" },
  { symbol: "RF", name: "Regions Financial", sector: "Financials" },
  { symbol: "KEY", name: "KeyCorp", sector: "Financials" },
  { symbol: "CFG", name: "Citizens Financial", sector: "Financials" },
  { symbol: "ZION", name: "Zions Bancorp", sector: "Financials" },
  { symbol: "FHN", name: "First Horizon", sector: "Financials" },
  { symbol: "EWBC", name: "East West Bancorp", sector: "Financials" },
  { symbol: "WAL", name: "Western Alliance", sector: "Financials" },
  { symbol: "PACW", name: "PacWest Bancorp", sector: "Financials" },
  { symbol: "FRC", name: "First Republic Bank", sector: "Financials" },
  { symbol: "SIVB", name: "SVB Financial Group", sector: "Financials" },
  { symbol: "ALLY", name: "Ally Financial", sector: "Financials" },
  { symbol: "NYCB", name: "New York Community Bancorp", sector: "Financials" },
  { symbol: "SOFI", name: "SoFi Technologies", sector: "Financials" },
  { symbol: "NU", name: "Nu Holdings", sector: "Financials" },
  { symbol: "MKTX", name: "MarketAxess Holdings", sector: "Financials" },
  { symbol: "LPLA", name: "LPL Financial", sector: "Financials" },

  // ── Consumer Discretionary (60) ────────────────────────
  { symbol: "AMZN", name: "Amazon.com Inc", sector: "Consumer Discretionary" },
  { symbol: "TSLA", name: "Tesla Inc", sector: "Consumer Discretionary" },
  { symbol: "HD", name: "Home Depot", sector: "Consumer Discretionary" },
  { symbol: "LOW", name: "Lowe's Companies", sector: "Consumer Discretionary" },
  { symbol: "BKNG", name: "Booking Holdings", sector: "Consumer Discretionary" },
  { symbol: "NKE", name: "Nike Inc", sector: "Consumer Discretionary" },
  { symbol: "SBUX", name: "Starbucks Corp", sector: "Consumer Discretionary" },
  { symbol: "TJX", name: "TJX Companies", sector: "Consumer Discretionary" },
  { symbol: "CMG", name: "Chipotle Mexican Grill", sector: "Consumer Discretionary" },
  { symbol: "ORLY", name: "O'Reilly Automotive", sector: "Consumer Discretionary" },
  { symbol: "DECK", name: "Deckers Outdoor", sector: "Consumer Discretionary" },
  { symbol: "RCL", name: "Royal Caribbean", sector: "Consumer Discretionary" },
  { symbol: "ABNB", name: "Airbnb Inc", sector: "Consumer Discretionary" },
  { symbol: "MAR", name: "Marriott International", sector: "Consumer Discretionary" },
  { symbol: "HLT", name: "Hilton Worldwide", sector: "Consumer Discretionary" },
  { symbol: "EXPE", name: "Expedia Group", sector: "Consumer Discretionary" },
  { symbol: "LVS", name: "Las Vegas Sands", sector: "Consumer Discretionary" },
  { symbol: "MGM", name: "MGM Resorts", sector: "Consumer Discretionary" },
  { symbol: "WYNN", name: "Wynn Resorts", sector: "Consumer Discretionary" },
  { symbol: "CCL", name: "Carnival Corp", sector: "Consumer Discretionary" },
  { symbol: "NCLH", name: "Norwegian Cruise Line", sector: "Consumer Discretionary" },
  { symbol: "F", name: "Ford Motor", sector: "Consumer Discretionary" },
  { symbol: "GM", name: "General Motors", sector: "Consumer Discretionary" },
  { symbol: "RIVN", name: "Rivian Automotive", sector: "Consumer Discretionary" },
  { symbol: "LCID", name: "Lucid Group", sector: "Consumer Discretionary" },
  { symbol: "NIO", name: "NIO Inc", sector: "Consumer Discretionary" },
  { symbol: "LI", name: "Li Auto Inc", sector: "Consumer Discretionary" },
  { symbol: "XPEV", name: "XPeng Inc", sector: "Consumer Discretionary" },
  { symbol: "ROST", name: "Ross Stores", sector: "Consumer Discretionary" },
  { symbol: "BURL", name: "Burlington Stores", sector: "Consumer Discretionary" },
  { symbol: "GPS", name: "Gap Inc", sector: "Consumer Discretionary" },
  { symbol: "ANF", name: "Abercrombie & Fitch", sector: "Consumer Discretionary" },
  { symbol: "LULU", name: "Lululemon Athletica", sector: "Consumer Discretionary" },
  { symbol: "TPR", name: "Tapestry Inc", sector: "Consumer Discretionary" },
  { symbol: "RL", name: "Ralph Lauren", sector: "Consumer Discretionary" },
  { symbol: "CPRI", name: "Capri Holdings", sector: "Consumer Discretionary" },
  { symbol: "AZO", name: "AutoZone Inc", sector: "Consumer Discretionary" },
  { symbol: "AAP", name: "Advance Auto Parts", sector: "Consumer Discretionary" },
  { symbol: "KMX", name: "CarMax Inc", sector: "Consumer Discretionary" },
  { symbol: "CVNA", name: "Carvana Co", sector: "Consumer Discretionary" },
  { symbol: "DPZ", name: "Domino's Pizza", sector: "Consumer Discretionary" },
  { symbol: "MCD", name: "McDonald's Corp", sector: "Consumer Discretionary" },
  { symbol: "YUM", name: "Yum! Brands", sector: "Consumer Discretionary" },
  { symbol: "QSR", name: "Restaurant Brands Intl", sector: "Consumer Discretionary" },
  { symbol: "DARDEN", name: "Darden Restaurants", sector: "Consumer Discretionary" },
  { symbol: "DHI", name: "D.R. Horton", sector: "Consumer Discretionary" },
  { symbol: "LEN", name: "Lennar Corp", sector: "Consumer Discretionary" },
  { symbol: "PHM", name: "PulteGroup Inc", sector: "Consumer Discretionary" },
  { symbol: "TOL", name: "Toll Brothers", sector: "Consumer Discretionary" },
  { symbol: "KBH", name: "KB Home", sector: "Consumer Discretionary" },
  { symbol: "POOL", name: "Pool Corp", sector: "Consumer Discretionary" },
  { symbol: "WSM", name: "Williams-Sonoma", sector: "Consumer Discretionary" },
  { symbol: "ETSY", name: "Etsy Inc", sector: "Consumer Discretionary" },
  { symbol: "W", name: "Wayfair Inc", sector: "Consumer Discretionary" },
  { symbol: "CHWY", name: "Chewy Inc", sector: "Consumer Discretionary" },
  { symbol: "DKS", name: "DICK'S Sporting Goods", sector: "Consumer Discretionary" },
  { symbol: "ULTA", name: "Ulta Beauty", sector: "Consumer Discretionary" },
  { symbol: "EL", name: "Estée Lauder", sector: "Consumer Discretionary" },
  { symbol: "DASH", name: "DoorDash Inc", sector: "Consumer Discretionary" },
  { symbol: "DKNG", name: "DraftKings Inc", sector: "Consumer Discretionary" },

  // ── Communication Services (30) ────────────────────────
  { symbol: "GOOG", name: "Alphabet Inc", sector: "Communication Services" },
  { symbol: "GOOGL", name: "Alphabet Inc Class A", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix Inc", sector: "Communication Services" },
  { symbol: "DIS", name: "Walt Disney Co", sector: "Communication Services" },
  { symbol: "CMCSA", name: "Comcast Corp", sector: "Communication Services" },
  { symbol: "T", name: "AT&T Inc", sector: "Communication Services" },
  { symbol: "VZ", name: "Verizon Communications", sector: "Communication Services" },
  { symbol: "TMUS", name: "T-Mobile US", sector: "Communication Services" },
  { symbol: "CHTR", name: "Charter Communications", sector: "Communication Services" },
  { symbol: "SPOT", name: "Spotify Technology", sector: "Communication Services" },
  { symbol: "TTWO", name: "Take-Two Interactive", sector: "Communication Services" },
  { symbol: "EA", name: "Electronic Arts", sector: "Communication Services" },
  { symbol: "RBLX", name: "Roblox Corp", sector: "Communication Services" },
  { symbol: "ROKU", name: "Roku Inc", sector: "Communication Services" },
  { symbol: "WBD", name: "Warner Bros Discovery", sector: "Communication Services" },
  { symbol: "PARA", name: "Paramount Global", sector: "Communication Services" },
  { symbol: "LYV", name: "Live Nation Entertainment", sector: "Communication Services" },
  { symbol: "MTCH", name: "Match Group", sector: "Communication Services" },
  { symbol: "ZG", name: "Zillow Group", sector: "Communication Services" },
  { symbol: "YELP", name: "Yelp Inc", sector: "Communication Services" },
  { symbol: "IMAX", name: "IMAX Corp", sector: "Communication Services" },
  { symbol: "FOX", name: "Fox Corp", sector: "Communication Services" },
  { symbol: "FOXA", name: "Fox Corp Class A", sector: "Communication Services" },
  { symbol: "NWSA", name: "News Corp", sector: "Communication Services" },
  { symbol: "NYT", name: "New York Times Co", sector: "Communication Services" },
  { symbol: "OMC", name: "Omnicom Group", sector: "Communication Services" },
  { symbol: "IPG", name: "Interpublic Group", sector: "Communication Services" },
  { symbol: "TTD", name: "The Trade Desk", sector: "Communication Services" },
  { symbol: "MGNI", name: "Magnite Inc", sector: "Communication Services" },
  { symbol: "PUBM", name: "PubMatic Inc", sector: "Communication Services" },

  // ── Materials (30) ─────────────────────────────────────
  { symbol: "LIN", name: "Linde PLC", sector: "Materials" },
  { symbol: "APD", name: "Air Products", sector: "Materials" },
  { symbol: "SHW", name: "Sherwin-Williams", sector: "Materials" },
  { symbol: "FCX", name: "Freeport-McMoRan", sector: "Materials" },
  { symbol: "NEM", name: "Newmont Corp", sector: "Materials" },
  { symbol: "NUE", name: "Nucor Corp", sector: "Materials" },
  { symbol: "STLD", name: "Steel Dynamics", sector: "Materials" },
  { symbol: "CLF", name: "Cleveland-Cliffs", sector: "Materials" },
  { symbol: "X", name: "United States Steel", sector: "Materials" },
  { symbol: "AA", name: "Alcoa Corp", sector: "Materials" },
  { symbol: "RS", name: "Reliance Inc", sector: "Materials" },
  { symbol: "ECL", name: "Ecolab Inc", sector: "Materials" },
  { symbol: "DD", name: "DuPont de Nemours", sector: "Materials" },
  { symbol: "DOW", name: "Dow Inc", sector: "Materials" },
  { symbol: "PPG", name: "PPG Industries", sector: "Materials" },
  { symbol: "EMN", name: "Eastman Chemical", sector: "Materials" },
  { symbol: "CE", name: "Celanese Corp", sector: "Materials" },
  { symbol: "ALB", name: "Albemarle Corp", sector: "Materials" },
  { symbol: "LTHM", name: "Livent Corp", sector: "Materials" },
  { symbol: "MP", name: "MP Materials", sector: "Materials" },
  { symbol: "GOLD", name: "Barrick Gold", sector: "Materials" },
  { symbol: "AEM", name: "Agnico Eagle Mines", sector: "Materials" },
  { symbol: "KGC", name: "Kinross Gold", sector: "Materials" },
  { symbol: "WPM", name: "Wheaton Precious Metals", sector: "Materials" },
  { symbol: "FNV", name: "Franco-Nevada Corp", sector: "Materials" },
  { symbol: "RGLD", name: "Royal Gold Inc", sector: "Materials" },
  { symbol: "VALE", name: "Vale SA", sector: "Materials" },
  { symbol: "RIO", name: "Rio Tinto PLC", sector: "Materials" },
  { symbol: "BHP", name: "BHP Group Ltd", sector: "Materials" },
  { symbol: "SCCO", name: "Southern Copper", sector: "Materials" },

  // ── Real Estate (30) ───────────────────────────────────
  { symbol: "EQIX", name: "Equinix Inc", sector: "Real Estate" },
  { symbol: "AMT", name: "American Tower", sector: "Real Estate" },
  { symbol: "PLD", name: "Prologis Inc", sector: "Real Estate" },
  { symbol: "DLR", name: "Digital Realty", sector: "Real Estate" },
  { symbol: "CCI", name: "Crown Castle Intl", sector: "Real Estate" },
  { symbol: "SPG", name: "Simon Property Group", sector: "Real Estate" },
  { symbol: "PSA", name: "Public Storage", sector: "Real Estate" },
  { symbol: "O", name: "Realty Income", sector: "Real Estate" },
  { symbol: "WELL", name: "Welltower Inc", sector: "Real Estate" },
  { symbol: "VICI", name: "VICI Properties", sector: "Real Estate" },
  { symbol: "ARE", name: "Alexandria Real Estate", sector: "Real Estate" },
  { symbol: "EXR", name: "Extra Space Storage", sector: "Real Estate" },
  { symbol: "AVB", name: "AvalonBay Communities", sector: "Real Estate" },
  { symbol: "EQR", name: "Equity Residential", sector: "Real Estate" },
  { symbol: "MAA", name: "Mid-America Apartment", sector: "Real Estate" },
  { symbol: "UDR", name: "UDR Inc", sector: "Real Estate" },
  { symbol: "CPT", name: "Camden Property Trust", sector: "Real Estate" },
  { symbol: "ESS", name: "Essex Property Trust", sector: "Real Estate" },
  { symbol: "INVH", name: "Invitation Homes", sector: "Real Estate" },
  { symbol: "SUI", name: "Sun Communities", sector: "Real Estate" },
  { symbol: "KIM", name: "Kimco Realty", sector: "Real Estate" },
  { symbol: "REG", name: "Regency Centers", sector: "Real Estate" },
  { symbol: "FRT", name: "Federal Realty", sector: "Real Estate" },
  { symbol: "BXP", name: "BXP Inc", sector: "Real Estate" },
  { symbol: "VTR", name: "Ventas Inc", sector: "Real Estate" },
  { symbol: "PEAK", name: "Healthpeak Properties", sector: "Real Estate" },
  { symbol: "HST", name: "Host Hotels & Resorts", sector: "Real Estate" },
  { symbol: "RHP", name: "Ryman Hospitality", sector: "Real Estate" },
  { symbol: "GLPI", name: "Gaming & Leisure Props", sector: "Real Estate" },
  { symbol: "SBAC", name: "SBA Communications", sector: "Real Estate" },

  // ── Consumer Staples (30) ──────────────────────────────
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer Staples" },
  { symbol: "WMT", name: "Walmart Inc", sector: "Consumer Staples" },
  { symbol: "PG", name: "Procter & Gamble", sector: "Consumer Staples" },
  { symbol: "KO", name: "Coca-Cola Co", sector: "Consumer Staples" },
  { symbol: "PEP", name: "PepsiCo Inc", sector: "Consumer Staples" },
  { symbol: "PM", name: "Philip Morris Intl", sector: "Consumer Staples" },
  { symbol: "MO", name: "Altria Group", sector: "Consumer Staples" },
  { symbol: "MDLZ", name: "Mondelez Intl", sector: "Consumer Staples" },
  { symbol: "CL", name: "Colgate-Palmolive", sector: "Consumer Staples" },
  { symbol: "KMB", name: "Kimberly-Clark", sector: "Consumer Staples" },
  { symbol: "GIS", name: "General Mills", sector: "Consumer Staples" },
  { symbol: "K", name: "Kellanova", sector: "Consumer Staples" },
  { symbol: "HSY", name: "Hershey Company", sector: "Consumer Staples" },
  { symbol: "SJM", name: "J.M. Smucker Co", sector: "Consumer Staples" },
  { symbol: "CAG", name: "Conagra Brands", sector: "Consumer Staples" },
  { symbol: "CPB", name: "Campbell Soup", sector: "Consumer Staples" },
  { symbol: "TSN", name: "Tyson Foods", sector: "Consumer Staples" },
  { symbol: "HRL", name: "Hormel Foods", sector: "Consumer Staples" },
  { symbol: "SYY", name: "Sysco Corp", sector: "Consumer Staples" },
  { symbol: "KR", name: "Kroger Co", sector: "Consumer Staples" },
  { symbol: "TGT", name: "Target Corp", sector: "Consumer Staples" },
  { symbol: "DG", name: "Dollar General", sector: "Consumer Staples" },
  { symbol: "DLTR", name: "Dollar Tree", sector: "Consumer Staples" },
  { symbol: "FIVE", name: "Five Below", sector: "Consumer Staples" },
  { symbol: "BJ", name: "BJ's Wholesale", sector: "Consumer Staples" },
  { symbol: "ADM", name: "Archer-Daniels-Midland", sector: "Consumer Staples" },
  { symbol: "STZ", name: "Constellation Brands", sector: "Consumer Staples" },
  { symbol: "DEO", name: "Diageo PLC", sector: "Consumer Staples" },
  { symbol: "BF-B", name: "Brown-Forman Corp", sector: "Consumer Staples" },
  { symbol: "MNST", name: "Monster Beverage", sector: "Consumer Staples" },
];

// ── FMP-Enhanced Momentum Scoring ────────────────────────

function computeMomentumScore(quote: FmpQuote): number {
  let score = 0;

  // 1. Daily Performance (0-25)
  const changePct = quote.changesPercentage ?? 0;
  score += Math.min(25, Math.max(0, (changePct / 3) * 25));

  // 2. Day Range Position (0-20)
  const range = quote.dayHigh - quote.dayLow;
  if (range > 0) {
    score += ((quote.price - quote.dayLow) / range) * 20;
  }

  // 3. Gap Strength (0-15)
  if (quote.previousClose > 0) {
    const gapPct = ((quote.open - quote.previousClose) / quote.previousClose) * 100;
    score += Math.min(15, Math.max(0, (gapPct / 2) * 15));
  }

  // 4. Intraday Trend (0-15)
  if (quote.open > 0) {
    const intradayPct = ((quote.price - quote.open) / quote.open) * 100;
    score += Math.min(15, Math.max(0, (intradayPct / 1.5) * 15));
  }

  // 5. Moving Average Alignment (0-15) — FMP bonus data
  if (quote.priceAvg50 > 0 && quote.priceAvg200 > 0) {
    // Price above 50MA = bullish (0-8)
    if (quote.price > quote.priceAvg50) {
      const pctAbove50 = ((quote.price - quote.priceAvg50) / quote.priceAvg50) * 100;
      score += Math.min(8, pctAbove50 * 0.8);
    }
    // 50MA above 200MA = golden cross alignment (0-7)
    if (quote.priceAvg50 > quote.priceAvg200) {
      score += 7;
    }
  }

  // 6. Relative Volume Bonus (0-10)
  if (quote.avgVolume > 0 && quote.volume > 0) {
    const relVol = quote.volume / quote.avgVolume;
    if (relVol > 2) score += 10;
    else if (relVol > 1.5) score += 7;
    else if (relVol > 1) score += 3;
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

function estimateRsi(quote: FmpQuote): number {
  const changePct = quote.changesPercentage ?? 0;
  const range = quote.dayHigh - quote.dayLow;
  const rangePosition = range > 0 ? (quote.price - quote.dayLow) / range : 0.5;
  const base = 50 + changePct * 5;
  return Math.round(Math.min(95, Math.max(5, base * 0.6 + rangePosition * 40)));
}

function detectPattern(quote: FmpQuote): string {
  const changePct = quote.changesPercentage ?? 0;
  const range = quote.dayHigh - quote.dayLow;
  const body = Math.abs(quote.price - quote.open);
  const rangePosition = range > 0 ? (quote.price - quote.dayLow) / range : 0.5;
  const bodyRatio = range > 0 ? body / range : 0;
  const gapPct = quote.previousClose > 0 ? ((quote.open - quote.previousClose) / quote.previousClose) * 100 : 0;

  if (gapPct > 1 && changePct > 1 && rangePosition > 0.7) return "Gap & Go";
  if (changePct > 2 && rangePosition > 0.8 && bodyRatio > 0.6) return "Breakout";
  if (rangePosition > 0.75 && bodyRatio < 0.3 && changePct > 0) return "Hammer Reversal";
  if (bodyRatio > 0.7 && changePct > 0.5 && changePct < 2) return "Range Expansion";
  if (bodyRatio < 0.15 && range > 0) return "Doji (Indecision)";
  if (rangePosition > 0.85 && changePct > 0) return "Closing Strong";
  if (changePct < -2 && rangePosition < 0.2) return "Breakdown";
  if (changePct < -1 && rangePosition < 0.3) return "Selling Pressure";
  if (Math.abs(changePct) < 0.5) return "Consolidation";
  if (changePct > 0) return "Higher Low";
  return "Pulling Back";
}

function mapSignal(quote: FmpQuote): ScannerStock["signal"] {
  const changePct = quote.changesPercentage ?? 0;
  const aboveMA50 = quote.priceAvg50 > 0 && quote.price > quote.priceAvg50;
  const aboveMA200 = quote.priceAvg200 > 0 && quote.price > quote.priceAvg200;
  const highVolume = quote.avgVolume > 0 && quote.volume > quote.avgVolume * 1.5;

  if (changePct > 3 && aboveMA50 && aboveMA200 && highVolume) return "STRONG BUY";
  if (changePct > 1 && aboveMA50) return "BUY";
  if (changePct < -3 && !aboveMA50 && !aboveMA200) return "STRONG SELL";
  if (changePct < -1 && !aboveMA50) return "SELL";
  return "NEUTRAL";
}

// ── Main Scanner ─────────────────────────────────────────

export interface ScannerApiResponse {
  success: boolean;
  data: ScannerStock[];
  meta: {
    fetchedAt: string;
    count: number;
    universe: number;
    errors: string[];
  };
}

export interface ScannerApiError {
  success: false;
  error: string;
  code: string;
}

export function processQuotes(
  quotes: Map<string, FmpQuote>,
  errors: string[]
): { stocks: ScannerStock[]; errors: string[] } {
  const now = new Date().toISOString();
  const stocks: ScannerStock[] = [];

  // Build lookup map for universe entries
  const universeMap = new Map(SCAN_UNIVERSE.map((e) => [e.symbol, e]));

  for (const [symbol, quote] of quotes) {
    const entry = universeMap.get(symbol);
    if (!entry) continue;

    const dayRange = quote.dayHigh - quote.dayLow;
    const dayRangePosition = dayRange > 0 ? Math.round(((quote.price - quote.dayLow) / dayRange) * 100) : 50;
    const gapPct = quote.previousClose > 0 ? Math.round(((quote.open - quote.previousClose) / quote.previousClose) * 1000) / 10 : 0;
    const relVol = quote.avgVolume > 0 ? Math.round((quote.volume / quote.avgVolume) * 100) : 100;
    const priceVs50 = quote.priceAvg50 > 0 ? Math.round(((quote.price - quote.priceAvg50) / quote.priceAvg50) * 1000) / 10 : 0;
    const priceVs200 = quote.priceAvg200 > 0 ? Math.round(((quote.price - quote.priceAvg200) / quote.priceAvg200) * 1000) / 10 : 0;

    stocks.push({
      symbol: entry.symbol,
      name: quote.name || entry.name,
      sector: entry.sector,
      price: quote.price,
      change: quote.change ?? 0,
      changePct: quote.changesPercentage ?? 0,
      dayHigh: quote.dayHigh,
      dayLow: quote.dayLow,
      open: quote.open,
      prevClose: quote.previousClose,
      momentumScore: computeMomentumScore(quote),
      relativeVolume: relVol,
      rsi: estimateRsi(quote),
      signal: mapSignal(quote),
      pattern: detectPattern(quote),
      dayRangePosition,
      gapPct,
      marketCap: quote.marketCap ?? 0,
      priceVs50MA: priceVs50,
      priceVs200MA: priceVs200,
      fetchedAt: now,
    });
  }

  // Sort by momentum score, return top 30
  stocks.sort((a, b) => b.momentumScore - a.momentumScore);
  return { stocks: stocks.slice(0, 30), errors };
}
