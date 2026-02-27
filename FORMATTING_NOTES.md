# Conversion Instructions and Formatting Notes

This document provides guidance for converting `CAPSTONE_THESIS.md` to a Word document (.docx) that meets standard capstone thesis formatting requirements, aligned with the BGFC Tabulation Scorer System thesis format.

## General Formatting

| Element | Specification |
|---------|---------------|
| **Font** | Times New Roman, 12 pt (body text) |
| **Font (Headings)** | Times New Roman, 12–14 pt, Bold |
| **Margins** | 1 inch (2.54 cm) on all sides |
| **Line Spacing** | 1.5 or double spacing for body text |
| **Alignment** | Justified for body paragraphs; center for title page and section headers |
| **Page Size** | Letter (8.5" × 11") or A4 |

## Section-Specific Formatting

### Title Page
- Center all text vertically and horizontally
- Title: ALL CAPS or Title Case, bold, 14–16 pt
- "Presented to" / "In Partial Fulfilment" / degree: 12 pt
- Researcher name(s) and year: 12 pt, bottom of page
- Use horizontal rules (______) as separators where shown in the reference

### Approval Sheet
- "APPROVAL SHEET" centered, bold
- Signature lines with underscores
- Chairman, Member, Dean labels below lines
- Page number: Roman numeral (i)

### Acknowledgement
- "ACKNOWLEDGEMENT" centered, bold
- Body text: 12 pt, 1.5 spacing, justified
- Page number: Roman numeral (ii)

### Table of Contents
- "TABLE OF CONTENTS" centered, bold
- Use dot leaders (......) between entries and page numbers
- Chapter titles in bold; subsections indented
- Page number: Roman numeral (iii)

### Chapter Pages
- Chapter number and title: centered, bold, 14 pt (e.g., "CHAPTER 1", "INTRODUCTION")
- Major section headers (e.g., "PROJECT CONTEXT"): bold, 12 pt, left-aligned or centered
- Subsection headers: bold, 12 pt, left-aligned
- Body paragraphs: 12 pt, 1.5 spacing, justified
- Page numbers: Arabic numerals, starting from 1 for Chapter 1

### Tables
- Table number and title above table (e.g., "Table 1. Likert-Scale Description")
- Borders: 1 pt for outer and inner lines
- Header row: bold
- Font: 11–12 pt

### Figures
- Figure number and caption below figure (e.g., "Figure 1. System Architecture")
- Center figures on page
- Reference figures in text before they appear

## Conversion Methods

### Option 1: Pandoc (Recommended)
```bash
pandoc CAPSTONE_THESIS.md -o Garbage_Tracking_System_Thesis.docx \
  --reference-doc=reference.docx
```
Create a `reference.docx` with your institution's styles (margins, fonts, spacing) and use it as a template.

### Option 2: Microsoft Word
1. Open Word
2. File → Open → select `CAPSTONE_THESIS.md` (Word can import Markdown)
3. Or: Copy content from the .md file and paste into Word
4. Apply styles: Heading 1, Heading 2, Normal, etc.
5. Set margins, font, and line spacing via Page Layout / Layout

### Option 3: Google Docs
1. Upload or paste the Markdown content
2. Use Format → Paragraph to set line spacing
3. Use Format → Font to set Times New Roman, 12 pt
4. Download as .docx

## Placeholder Replacements

Before final submission, replace the following placeholders in `CAPSTONE_THESIS.md`:

- `[Researcher Name(s)]` – Full name(s) of researcher(s)
- `[Year]` – Year of submission (e.g., 2025)
- `[Researcher Name]` – For Curriculum Vitae section
- Curriculum Vitae details: Age, Date of Birth, Civil Status, Religion, Place of Birth, Home Address, Email, Contact Number, Educational institutions

## Page Numbering

- **Preliminary pages** (Title, Approval, Acknowledgement, Table of Contents): Roman numerals (i, ii, iii, …)
- **Main body** (Chapter 1 onward): Arabic numerals (1, 2, 3, …)
- Position: Bottom center or bottom right

## Checklist Before Submission

- [ ] All placeholders replaced with actual information
- [ ] Page numbers correct and consistent
- [ ] Tables and figures numbered sequentially
- [ ] References to figures/tables in text are correct
- [ ] Spelling and grammar checked
- [ ] Margins and spacing match institution requirements
- [ ] Approval sheet signatures obtained
- [ ] Curriculum Vitae completed for each researcher
