import { bi, t } from "@/lib/lang";

/**
 * Day 6 reference list. Cards cite by key; each `References` accordion shows the union of what its own cards cite. Every entry is a
 * published work or an official standard cited by its usual reference; the bracketed note says what the card takes from it.
 */
export type RefKey =
  | "jones1995"
  | "oliver1997"
  | "kano1984"
  | "reichheld1996"
  | "morgan1994"
  | "gustafsson2005"
  | "palmatier2006"
  | "dixon2010"
  | "heskett1994"
  | "rackham1988"
  | "adamson2012"
  | "cialdini2021"
  | "meadows1999"
  | "pmi2021"
  | "courtney1997"
  | "klein2007"
  | "doran1981"
  | "deming1986";

export type Reference = { key: RefKey; chip: string; full: string };

const r = (key: RefKey, chip: string, en: string, de: string) => ({ key, chip, full: t(en, de) });

export const REFERENCES: Record<RefKey, Reference> = bi({
  jones1995: r("jones1995", "Jones & Sasser 1995", "Jones, T. O., & Sasser, W. E. (1995). Why satisfied customers defect. Harvard Business Review, 73(6), 88–99. (Only completely satisfied customers are reliably loyal; merely satisfied ones leave.)", "Jones, T. O., & Sasser, W. E. (1995). Why satisfied customers defect. Harvard Business Review, 73(6), 88–99. (Nur völlig zufriedene Kunden sind verlässlich treu; bloß zufriedene gehen.)"),
  oliver1997: r("oliver1997", "Oliver et al. 1997", "Oliver, R. L., Rust, R. T., & Varki, S. (1997). Customer delight: Foundations, findings, and managerial insight. Journal of Retailing, 73(3), 311–336. (Delight: a positive surprise plus joy, beyond satisfaction.)", "Oliver, R. L., Rust, R. T., & Varki, S. (1997). Customer delight: Foundations, findings, and managerial insight. Journal of Retailing, 73(3), 311–336. (Begeisterung: eine positive Überraschung plus Freude, über Zufriedenheit hinaus.)"),
  kano1984: r("kano1984", "Kano et al. 1984", "Kano, N., Seraku, N., Takahashi, F., & Tsuji, S. (1984). Attractive quality and must-be quality. Journal of the Japanese Society for Quality Control, 14(2), 39–48. (Basic, performance and delight factors.)", "Kano, N., Seraku, N., Takahashi, F., & Tsuji, S. (1984). Attractive quality and must-be quality. Journal of the Japanese Society for Quality Control, 14(2), 39–48. (Basis-, Leistungs- und Begeisterungsfaktoren.)"),
  reichheld1996: r("reichheld1996", "Reichheld 1996", "Reichheld, F. F. (1996). The Loyalty Effect. Harvard Business School Press. (The economics of keeping customers.)", "Reichheld, F. F. (1996). The Loyalty Effect. Harvard Business School Press. (Die Ökonomie des Kundenhaltens.)"),
  morgan1994: r("morgan1994", "Morgan & Hunt 1994", "Morgan, R. M., & Hunt, S. D. (1994). The commitment-trust theory of relationship marketing. Journal of Marketing, 58(3), 20–38. (Trust and commitment as the centre of lasting business relationships.)", "Morgan, R. M., & Hunt, S. D. (1994). The commitment-trust theory of relationship marketing. Journal of Marketing, 58(3), 20–38. (Vertrauen und Commitment als Kern dauerhafter Geschäftsbeziehungen.)"),
  gustafsson2005: r("gustafsson2005", "Gustafsson et al. 2005", "Gustafsson, A., Johnson, M. D., & Roos, I. (2005). The effects of customer satisfaction, relationship commitment dimensions, and triggers on customer retention. Journal of Marketing, 69(4), 210–218. (Affective commitment keeps customers beyond satisfaction.)", "Gustafsson, A., Johnson, M. D., & Roos, I. (2005). The effects of customer satisfaction, relationship commitment dimensions, and triggers on customer retention. Journal of Marketing, 69(4), 210–218. (Affektive Bindung hält Kunden über Zufriedenheit hinaus.)"),
  palmatier2006: r("palmatier2006", "Palmatier et al. 2006", "Palmatier, R. W., Dant, R. P., Grewal, D., & Evans, K. R. (2006). Factors influencing the effectiveness of relationship marketing: A meta-analysis. Journal of Marketing, 70(4), 136–153. (Relationships with a person matter more than relationships with a firm.)", "Palmatier, R. W., Dant, R. P., Grewal, D., & Evans, K. R. (2006). Factors influencing the effectiveness of relationship marketing: A meta-analysis. Journal of Marketing, 70(4), 136–153. (Beziehungen zu einer Person zählen mehr als zu einer Firma.)"),
  dixon2010: r("dixon2010", "Dixon et al. 2010", "Dixon, M., Freeman, K., & Toman, N. (2010). Stop trying to delight your customers. Harvard Business Review, 88(7/8), 116–122. (Reducing effort often does more than surprising; delight must not replace reliability.)", "Dixon, M., Freeman, K., & Toman, N. (2010). Stop trying to delight your customers. Harvard Business Review, 88(7/8), 116–122. (Aufwand zu senken bringt oft mehr als zu überraschen; Begeisterung darf Verlässlichkeit nicht ersetzen.)"),
  heskett1994: r("heskett1994", "Heskett et al. 1994", "Heskett, J. L., Jones, T. O., Loveman, G. W., Sasser, W. E., & Schlesinger, L. A. (1994). Putting the service-profit chain to work. Harvard Business Review, 72(2), 164–174. (Loyalty follows from the value customers experience in service.)", "Heskett, J. L., Jones, T. O., Loveman, G. W., Sasser, W. E., & Schlesinger, L. A. (1994). Putting the service-profit chain to work. Harvard Business Review, 72(2), 164–174. (Loyalität folgt aus dem Wert, den Kunden im Service erleben.)"),
  rackham1988: r("rackham1988", "Rackham 1988", "Rackham, N. (1988). SPIN Selling. McGraw-Hill. (Buying signals in large sales: questions about implementation and about risk mean different things.)", "Rackham, N. (1988). SPIN Selling. McGraw-Hill. (Kaufsignale im großen Vertrieb: Fragen zur Umsetzung und Fragen zum Risiko bedeuten Verschiedenes.)"),
  adamson2012: r("adamson2012", "Adamson et al. 2012", "Adamson, B., Dixon, M., & Toman, N. (2012). The end of solution sales. Harvard Business Review, 90(7/8), 60–68. (B2B buyers are far into their decision before they call a supplier.)", "Adamson, B., Dixon, M., & Toman, N. (2012). The end of solution sales. Harvard Business Review, 90(7/8), 60–68. (B2B-Käufer sind weit in ihrer Entscheidung, bevor sie einen Anbieter anrufen.)"),
  cialdini2021: r("cialdini2021", "Cialdini 2021", "Cialdini, R. B. (2021). Influence, New and Expanded. Harper Business. (Reciprocity and social proof in the relationship.)", "Cialdini, R. B. (2021). Influence, New and Expanded. Harper Business. (Reziprozität und Social Proof in der Beziehung.)"),
  meadows1999: r("meadows1999", "Meadows 1999", "Meadows, D. H. (1999). Leverage Points: Places to Intervene in a System. The Sustainability Institute. (Rules and structures move a system more than individual actions.)", "Meadows, D. H. (1999). Leverage Points: Places to Intervene in a System. The Sustainability Institute. (Regeln und Strukturen bewegen ein System mehr als einzelne Handlungen.)"),
  pmi2021: r("pmi2021", "PMI 2021", "Project Management Institute (2021). A Guide to the Project Management Body of Knowledge (PMBOK Guide), 7th ed. (The responsibility assignment matrix: responsible, accountable, consulted, informed.)", "Project Management Institute (2021). A Guide to the Project Management Body of Knowledge (PMBOK Guide), 7. Aufl. (Die Verantwortungsmatrix: Responsible, Accountable, Consulted, Informed.)"),
  courtney1997: r("courtney1997", "Courtney et al. 1997", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Match the commitment to how much is known.)", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Die Festlegung daran ausrichten, wie viel man weiß.)"),
  klein2007: r("klein2007", "Klein 2007", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Imagine the plan has failed and write down why, before it starts.)", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Sich vorstellen, der Plan sei gescheitert, und aufschreiben warum, bevor er startet.)"),
  doran1981: r("doran1981", "Doran 1981", "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36.", "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36."),
  deming1986: r("deming1986", "Deming 1986", "Deming, W. E. (1986). Out of the Crisis. MIT Center for Advanced Engineering Study. (Plan, do, study, act.)", "Deming, W. E. (1986). Out of the Crisis. MIT Center for Advanced Engineering Study. (Plan, Do, Study, Act.)"),
});

export const refFull = (key: RefKey) => REFERENCES[key].full;
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
