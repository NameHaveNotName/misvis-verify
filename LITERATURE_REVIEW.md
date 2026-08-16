# Literature Review: MisVis Verify

**Research topic:** Beyond the AI Label: How Provenance Cues and Evidence-Grounded Visual Verification Shape Trust in Misleading Visualizations

**Date:** 2026-08-15
**Sources:** OpenAlex API searches + targeted retrieval; raw search outputs saved in `literature_search_openalex_*.json`

---

## 1. Purpose of this review

This review identifies English-language literature relevant to three research questions (RQs):

1. How does AI provenance disclosure affect trust and discernment between accurate and misleading visualizations?
2. Can evidence-grounded visual verification (EGVV) reduce provenance-driven heuristic judgments and improve trust calibration?
3. Do the effects of verification transfer to unseen visualizations after assistance is removed?

For each theme I summarize the most relevant papers, note their relationship to MisVis Verify, and flag methodological or theoretical limitations that should inform our design.

---

## 2. Misleading visualizations: mechanisms and taxonomies

### 2.1 Foundational work

**Cleveland, W. S., & McGill, R. (1984).** *Graphical perception: Theory, experimentation, and application to the development of graphical methods.* Journal of the American Statistical Association, 79(387), 531–554.

- Positions visual decoding along a hierarchy of perceptual tasks (position > length > angle > area > volume > color hue).
- Directly informs our six manipulations: truncated axis (length), area distortion (area/radius), cherry-picking (position/trend), color emphasis (color hue saturation as attention cue).
- **Caution:** Cleveland & McGill measured accuracy of value extraction, not trust or credibility. We must not equate perceptual accuracy with trust calibration.

**Talbot, J., Setlur, V., & Anand, A. (2014).** *Four experiments on the perception of bar charts.* IEEE TVCG, 20(12), 2152–2160.

- Replicates and extends Cleveland & McGill for bar charts; confirms that stacked and adjacent bars distort judgment.
- Relevant for M1 (truncated axis) stimulus design.

**Tufte, E. R. (1983).** *The Visual Display of Quantitative Information.* Graphics Press.

- Introduces the "lie factor" and champions high data-ink ratio.
- Provides normative grounding for what counts as a "faithful" alternative in our Compare step.
- **Caution:** Tufte's prescriptions are design ideals, not empirical evidence about viewer behavior under AI provenance cues.

### 2.2 Deceptive visualization as a research object

**Pandey, A. V., Rall, K., Satterthwaite, M. L., Nov, O., & Bertini, E. (2015).** *How deceptive are deceptive visualizations?* CHI 2015, 1969–1978.

- One of the first controlled experiments showing that common distortions (truncated axis, inverted axis, etc.) systematically bias viewers.
- Demonstrates matched-pair methodology: same data, two encodings.
- **Direct relevance:** Validates the core stimulus logic of MisVis Verify (accurate vs. misleading versions of the same data).
- **Limitation:** Measures perceived differences and recall, not trust or source credibility; no intervention condition.

**Correll, M., & Heer, J. (2017).** *Black Hat Visualization.* (Workshop / position paper at VIS 2017).

- Argues that visualization can be intentionally weaponized and calls for an adversarial research agenda.
- Provides ethical framing: we are not teaching cynicism but calibration.
- **Caution:** Position paper; does not offer an empirical intervention to copy.

**Lisnic, M., Polychronis, C., & Lex, A. (2022/2023).** *Misleading Beyond Visual Tricks: How People Actually Lie with Charts.* CHI 2023, 1–17.

- Taxonomy of how people lie with charts beyond classic visual tricks: data selection, statistical transformation, annotation, etc.
- Argues that misleading charts often look plausible and professional.
- **Critical implication for our H1/H2:** If misleading charts are visually polished, an "AI-assisted" label may not help viewers discriminate; it may just reduce trust globally. This supports measuring *discernment* (trust accurate − trust misleading) rather than only mean trust.

**Dimara, E., Franconeri, S., Plaisant, C., Bezerianos, A., & Dragicevic, P. (2018).** *A Task-Based Taxonomy of Cognitive Biases for Information Visualization.* IEEE TVCG, 24(8), 2366–2378.

- Catalogs biases at different visualization tasks (e.g., anchoring, framing, confirmation bias).
- Helps map each of our six mechanisms to a cognitive bias.
- **Use:** Justify the choice of mechanisms and the design of EGVV Explain steps.

---

## 3. Visualization literacy and assessment

### 3.1 Literacy scales

**Boy, J., Rensink, R., & Bertini, E. (2014).** *A Principled Way of Assessing Visualization Literacy.* IEEE TVCG, 20(12), 1963–1972.

- Proposes a psychometric approach to assessing visualization literacy via item response theory.
- **Relevance:** Provides a model for how to treat our baseline and transfer trials as ability indicators.
- **Caution:** The scale tests comprehension of well-formed charts, not skepticism toward misleading ones.

**Solen, M. (2022).** *Scoping the Future of Visualization Literacy: A Review.* OSF preprint.

- Reviews definitions and assessment tools; notes that "visualization literacy" is fragmented across comprehension, production, and critical evaluation.
- **Implication:** Our study deliberately targets the under-measured *critical-evaluation* dimension.

### 3.2 Critical thinking about visualizations

**Ge, L. W., Cui, Y., & Kay, M. (2023).** *CALVI: Critical Thinking Assessment for Literacy in Visualizations.* CHI 2023.

- Develops an assessment tool specifically for erroneous or potentially misleading visualizations.
- Argues existing literacy tests focus on well-formed charts and miss misinformation scenarios.
- **Direct relevance:** CALVI's item types (identify the problem, justify with evidence) mirror our EGVV logic.
- **Design implication:** We can borrow the idea of asking participants to justify judgments, but we must be careful not to overload the trial with open responses.

---

## 4. Source cues, provenance, and trust

### 4.1 Text and general media

**Jakesch, M., Hancock, J. T., & Naaman, M. (2023).** *Human heuristics for AI-generated language are flawed.* PNAS, 120(11), e2208839120.

- Shows that people cannot reliably detect AI-generated text and use flawed heuristics (e.g., fluency, personal disclosure).
- **Implication:** Viewers may bring flawed heuristics to "AI-assisted visualization" labels.

**Pennycook, G., & Rand, D. G. (2021).** *The Psychology of Fake News.* Trends in Cognitive Sciences, 25(5), 388–402.

- Argues that inattention to accuracy, not partisan motivation alone, explains much misinformation sharing.
- Accuracy nudges can improve discernment by shifting attention to veracity.
- **Implication:** Our EGVV can be framed as a domain-specific accuracy nudge for visual content.

**Ecker, U. K. H., Lewandowsky, S., Cook, J., Schmid, P., Fazio, L. K., Swire, B., … Acosta, A. (2022).** *The psychological drivers of misinformation belief and its resistance to correction.* Nature Reviews Psychology, 1(1), 13–29.

- Comprehensive review of correction, debunking, and continued influence.
- Warns that corrections can backfire or be ineffective if they repeat misinformation without clear refutation.
- **Design implication:** EGVV should avoid repeating the misleading framing without immediately providing evidence; our Verify step should precede or accompany any restatement of the misleading claim.

### 4.2 Visual / image provenance

**Feng, K. J. K., Ritchie, N., Blumenthal, P., … & Metzger, M. J. (2023).** *Examining the Impact of Provenance-Enabled Media on Trust and Accuracy Perceptions.* ACM TOCHI, 30(6), 1–32.

- Tests C2PA-style provenance labels for images.
- Finds provenance information can increase trust but effects depend on source reputation and prior skepticism.
- **Direct relevance:** This is the closest empirical precedent to our Provenance factor.
- **Critical caution:** Feng et al. used general images/photos, not data visualizations. Charts have their own evidentiary structure (axes, labels, data values), so results may not transfer directly.

**Trattner, C., Lys Forstner, S., Starke, A. D., … & de Vreese, C. (2025).** *C2PA Provenance Labels Increase Trust in News Platforms Across Western Countries.* OSF preprint.

- Cross-national study (N ≈ 8,000) showing C2PA labels increase trust in news platforms.
- **Relevance:** Shows provenance labels can have platform-level trust effects.
- **Critical caution:** The study measures institutional trust, not item-level discernment between accurate and misleading charts. A platform-wide trust boost is not the same as calibrated trust.

### 4.3 AI-assisted decision-making and appropriate trust

**Ma, S., Lei, Y., Wang, X., … & Yang, Q. (2023).** *Who Should I Trust: AI or Myself? Leveraging Human and AI Correctness Likelihood to Promote Appropriate Trust in AI-Assisted Decision-Making.* CHI 2023.

- Argues for "appropriate trust" rather than maximal or minimal trust.
- Emphasizes calibration: trust should match actual correctness likelihood.
- **Direct relevance:** Our dependent variable "trust calibration" aligns with this framework.
- **Limitation:** Domain is AI-assisted decision-making, not charts; their interventions are confidence indicators, not visual evidence.

---

## 5. Interventions for misleading charts

### 5.1 Annotation-based interventions

**Fan, A., Ma, Y., & Mancenido, M. V. (2022).** *Annotating Line Charts for Addressing Deception.* IUI 2022, 142–152.

- Proposes annotations that guide viewers to suspicious regions of line charts.
- Finds annotations can reduce deception for some distortion types.
- **Direct relevance:** Precedent for our Locate step and hotspot-style annotations.
- **Caution:** Their study focuses on line charts only; our six mechanisms require tailored EGVV content.

### 5.2 Debunking strategies

**Wijnker, W., Smeets, I., & Burger, J. P. (2022).** *Debunking strategies for misleading bar charts.* Journal of Data and Information Quality, 14(2), 1–17.

- Tests three debunking strategies for misleading bar charts: textual warning, corrected chart, and combination.
- Combination of textual warning + corrected chart is most effective.
- **Direct relevance:** Supports our four-step EGVV structure (Locate → Explain → Verify → Compare).
- **Critical caveat:** Their "corrected chart" is an answer-giving intervention. Our Compare step must be evidence-grounded, not simply displaying the correct version. We should measure whether this weaker form of guidance still transfers better.

---

## 6. Accuracy nudges and inoculation

**Pennycook, G., McPhetres, J., Zhang, Y., Lu, J. G., & Rand, D. G. (2020).** *Fighting COVID-19 Misinformation on Social Media: Experimental Evidence for a Scalable Accuracy-Nudge Intervention.* Psychological Science, 31(7), 770–780.

- A single accuracy prompt increases truth discernment in sharing decisions.
- **Relevance:** Our control condition ("please re-check axes, title, labels, encoding") is a minimal accuracy nudge; EGVV is a stronger, structured visual version.

**Lewandowsky, S., & van der Linden, S. (2017).** *The Debunking Handbook.*

- Recommendations: lead with the facts, avoid repeating the myth, provide an alternative explanation.
- **Implication:** EGVV Step 4 (Compare) should present a faithful alternative, not just negate the misleading chart.

---

## 7. Critical synthesis: what the literature says and does not say

### 7.1 What is well supported

1. **Misleading charts bias judgment.** Evidence from Pandey et al., Lisnic et al., and Dimara et al. supports using controlled matched-pair stimuli.
2. **Provenance labels can influence trust.** Evidence from Feng et al. and Trattner et al. supports manipulating AI/source labels.
3. **Accuracy nudges improve discernment in text.** Evidence from Pennycook & Rand supports some form of attention-shifting intervention.
4. **Annotations and corrected charts can reduce deception.** Evidence from Fan et al. and Wijnker et al. supports visual interventions.
5. **Trust should be calibrated, not maximized.** Framework from Ma et al. supports our focus on discernment metrics.

### 7.2 Key gaps this study fills

1. **From text/images to data visualizations.** Provenance research has focused on photos, deepfakes, and text. Charts contain *internally checkable evidence* (axes, values, titles). We test whether viewers use that evidence when prompted.

2. **From skepticism to calibration.** Prior work often reports "AI label reduces trust." We explicitly separate effects on accurate and misleading charts to test whether labels improve *discernment* or merely produce *general skepticism*.

3. **From answer-giving to evidence-grounded verification.** Wijnker et al. show corrected charts work, but giving answers may not transfer. EGVV teaches a reusable procedure (Locate → Explain → Verify → Compare).

4. **Transfer after assistance removal.** Few visualization interventions test whether effects persist when cues and annotations are removed. Our Transfer phase directly addresses this.

### 7.3 Methodological cautions from the literature

1. ** Ceiling / floor effects.** If baseline trust is already low (high skepticism), an AI label may have little room to reduce it. Pilot data must check baseline distributions.

2. **Demand characteristics.** If EGVV always follows misleading charts, participants may learn to expect problems. Counterbalancing and transfer trials help, but we must also include accurate charts in EGVV.

3. **Repeated exposure.** Showing 20 main + 16 transfer + 8 baseline charts may produce fatigue. Response-time and attention-check items should be built in.

4. **Population.** Most cited studies use online convenience samples (MTurk, Prolific, student pools). External validity claims should be modest.

5. **Mechanism specificity.** A general "check the chart" prompt may improve performance across all mechanisms; to claim mechanism-specific transfer we need far-transfer design and exploratory analysis.

6. **Provenance label valence.** The term "AI-assisted visualization" is deliberately neutral, but participants may interpret it differently. A manipulation check should assess perceived meaning.

---

## 8. Bibliography

- Boy, J., Rensink, R., & Bertini, E. (2014). A principled way of assessing visualization literacy. *IEEE TVCG*, 20(12), 1963–1972.
- Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application. *JASA*, 79(387), 531–554.
- Correll, M., & Heer, J. (2017). Black Hat Visualization. *VIS 2017 Workshop*.
- Dimara, E., Franconeri, S., Plaisant, C., Bezerianos, A., & Dragicevic, P. (2018). A task-based taxonomy of cognitive biases for information visualization. *IEEE TVCG*, 24(8), 2366–2378.
- Ecker, U. K. H., Lewandowsky, S., Cook, J., et al. (2022). The psychological drivers of misinformation belief and its resistance to correction. *Nature Reviews Psychology*, 1(1), 13–29.
- Fan, A., Ma, Y., & Mancenido, M. V. (2022). Annotating line charts for addressing deception. *IUI 2022*, 142–152.
- Feng, K. J. K., Ritchie, N., Blumenthal, P., et al. (2023). Examining the impact of provenance-enabled media on trust and accuracy perceptions. *ACM TOCHI*, 30(6), 1–32.
- Ge, L. W., Cui, Y., & Kay, M. (2023). CALVI: Critical thinking assessment for literacy in visualizations. *CHI 2023*.
- Jakesch, M., Hancock, J. T., & Naaman, M. (2023). Human heuristics for AI-generated language are flawed. *PNAS*, 120(11), e2208839120.
- Lisnic, M., Polychronis, C., & Lex, A. (2023). Misleading beyond visual tricks: How people actually lie with charts. *CHI 2023*, 1–17.
- Ma, S., Lei, Y., Wang, X., et al. (2023). Who should I trust: AI or myself? Leveraging human and AI correctness likelihood to promote appropriate trust. *CHI 2023*.
- Pandey, A. V., Rall, K., Satterthwaite, M. L., Nov, O., & Bertini, E. (2015). How deceptive are deceptive visualizations? *CHI 2015*, 1969–1978.
- Pennycook, G., & Rand, D. G. (2021). The psychology of fake news. *Trends in Cognitive Sciences*, 25(5), 388–402.
- Pennycook, G., McPhetres, J., Zhang, Y., Lu, J. G., & Rand, D. G. (2020). Fighting COVID-19 misinformation on social media: Experimental evidence for a scalable accuracy-nudge intervention. *Psychological Science*, 31(7), 770–780.
- Talbot, J., Setlur, V., & Anand, A. (2014). Four experiments on the perception of bar charts. *IEEE TVCG*, 20(12), 2152–2160.
- Trattner, C., Lys Forstner, S., Starke, A. D., et al. (2025). C2PA provenance labels increase trust in news platforms across Western countries. *OSF preprint*.
- Tufte, E. R. (1983). *The visual display of quantitative information*. Graphics Press.
- Wijnker, W., Smeets, I., & Burger, J. P. (2022). Debunking strategies for misleading bar charts. *Journal of Data and Information Quality*, 14(2), 1–17.

---

## 9. Open questions to resolve before development

1. Should the AI provenance label be placed *above* the chart, *below*, or integrated into a caption? Feng et al. used different placements; we need a single neutral placement for V1.
2. Should EGVV content be identical for accurate and misleading versions of a pair, or tailored only to the misleading version? If only misleading charts get EGVV, participants may learn that EGVV = suspicious.
3. How do we operationally define "misleading judgment"? Binary (Yes/No) plus Unsure is planned; literature often uses 7-point scales. A pilot item-level comparison would help.
4. What is the appropriate control condition? The current plan is a 3-second passive re-inspection prompt. Wijnker et al. suggest textual warning + corrected chart; our control is deliberately weaker to isolate EGVV effects.
5. How many open-response items can we include without attrition? The post-study questionnaire currently has one optional open item; this is consistent with brevity recommendations but may limit qualitative insight.

---

## 10. Judgment on the experimental plan

The literature supports the following plan-level decisions:

- **Use matched-pair stimuli.** Strong precedent from Pandey et al. and Cleveland & McGill.
- **Measure trust separately for accurate and misleading charts.** Necessary to distinguish calibration from skepticism.
- **Include a transfer phase.** Understudied in prior visualization intervention work; important for claims about learned skill.
- **Use a neutral "AI-assisted visualization" label.** Avoids confounding "AI-generated" with negative valence; consistent with transparency literature.
- **Keep EGVV evidence-grounded rather than answer-giving.** Better aligned with accuracy-nudge and inoculation principles; more likely to transfer.

The literature raises the following risks:

- AI labels may produce global skepticism rather than discernment (H2 is plausible).
- EGVV may be effective only when followed by a corrected chart; our weaker Compare step needs empirical justification.
- Demand characteristics and learning effects may inflate transfer performance; counterbalancing and exploratory far-transfer labeling are essential.
- Provenance effects on images may not generalize to charts; the study therefore tests a genuine boundary condition.
