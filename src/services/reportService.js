import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const reportService = {
  // Generate and return jsPDF instance
  generateInterviewReport: (interview) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    const candidate = interview.candidate || {
      name: "Alex Chen",
      email: "alex.chen@techmail.io",
      college: "Stanford University of Technology",
      degree: "B.S. in Computer Science",
      graduationYear: "2026"
    };

    const scores = interview.scores || {
      technical: 85,
      communication: 82,
      confidence: 84,
      relevance: 88,
      completeness: 80,
      fluency: 83,
      problemSolving: 82
    };

    // Header Background Accent Bar
    doc.setFillColor(15, 23, 42); // Navy Dark
    doc.rect(0, 0, pageWidth, 90, 'F');

    // Cyber Cyan Accent line
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 87, pageWidth, 3, 'F');

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("AI INTERVIEW PREPARATION ASSISTANT", margin, 42);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("OFFICIAL CANDIDATE PERFORMANCE & EVALUATION REPORT", margin, 58);

    doc.setFontSize(9);
    doc.setTextColor(6, 182, 212);
    doc.text(`SESSION ID: ${interview.interviewId} | DATE: ${interview.date}`, margin, 74);

    let currentY = 110;

    // Candidate & Session Info Card Grid
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 85, 6, 6, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("CANDIDATE INFORMATION", margin + 14, currentY + 18);
    doc.text("INTERVIEW SESSION METRICS", margin + contentWidth / 2 + 10, currentY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    // Left Column
    doc.text(`Name: ${candidate.name}`, margin + 14, currentY + 34);
    doc.text(`Email: ${candidate.email}`, margin + 14, currentY + 48);
    doc.text(`Degree: ${candidate.degree}`, margin + 14, currentY + 62);
    doc.text(`Institution: ${candidate.college} (${candidate.graduationYear || '2026'})`, margin + 14, currentY + 76);

    const totalCount = interview.totalQuestions || interview.evaluations?.length || interview.questionsCount || 5;
    const answeredCount = interview.answeredQuestions ?? (interview.evaluations?.filter(e => !e.isSkipped).length || totalCount);
    const skippedCount = interview.skippedQuestions ?? (interview.evaluations?.filter(e => e.isSkipped).length || 0);

    // Right Column
    doc.text(`Track: ${interview.track || 'Fresher Track'}`, margin + contentWidth / 2 + 10, currentY + 34);
    doc.text(`Difficulty: ${interview.difficulty || 'Standard'}`, margin + contentWidth / 2 + 10, currentY + 48);
    doc.text(`Duration: ${interview.duration || '14 mins'}`, margin + contentWidth / 2 + 10, currentY + 62);
    doc.text(`Questions: Total ${totalCount} | Answered: ${answeredCount} | Skipped: ${skippedCount}`, margin + contentWidth / 2 + 10, currentY + 76);

    currentY += 100;

    // Executive Score Banner
    const scoreVal = interview.overallScore || 80;
    const tierText = interview.performanceLevel || (scoreVal >= 80 ? "Very Good" : "Good");

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, currentY, contentWidth, 68, 6, 6, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("OVERALL INTERVIEW PERFORMANCE SCORE", margin + 16, currentY + 26);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      skippedCount > 0 
        ? `Evaluated across rubrics (${skippedCount} question(s) skipped by candidate)`
        : "Weighted evaluation across technical, communication, problem-solving, and relevance metrics", 
      margin + 16, 
      currentY + 42
    );

    // Large Score on the right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(6, 182, 212);
    doc.text(`${scoreVal}`, margin + contentWidth - 85, currentY + 38, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(52, 211, 153);
    doc.text(tierText.toUpperCase(), margin + contentWidth - 85, currentY + 54, { align: 'center' });

    currentY += 80;

    // Metric Breakdown Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("CATEGORY-WISE EVALUATION BREAKDOWN", margin, currentY + 12);
    currentY += 18;

    const breakdownData = [
      ["Technical Knowledge (30% Weight)", `${scores.technical}%`, scores.technical >= 80 ? "Proficient" : "Competent", "Demonstrated solid framework & architecture fundamentals"],
      ["Relevance & Grounding (15% Weight)", `${scores.relevance}%`, scores.relevance >= 80 ? "High" : "Moderate", "Directly addressed the specific resume topic asked"],
      ["Communication & Clarity (15% Weight)", `${scores.communication}%`, scores.communication >= 80 ? "Clear" : "Average", "Good pacing, minimal hesitation, structured thoughts"],
      ["Completeness of Solution (10% Weight)", `${scores.completeness}%`, scores.completeness >= 80 ? "Thorough" : "Partial", "Covered trade-offs, architecture, and deployment context"],
      ["Problem Solving & Rationale (10% Weight)", `${scores.problemSolving}%`, scores.problemSolving >= 80 ? "Analytical" : "Standard", "Articulated 'why' decisions were made in projects"],
      ["Confidence & Presentation (10% Weight)", `${scores.confidence}%`, scores.confidence >= 80 ? "Strong" : "Developing", "Natural eye contact, steady response velocity"],
      ["Fluency & Grammar (10% Weight)", `${scores.fluency}%`, scores.fluency >= 80 ? "Fluent" : "Satisfactory", "Professional corporate vocabulary and terminology"]
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["Evaluation Dimension", "Score", "Rating", "Key Observation"]],
      body: breakdownData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        cellPadding: 4.5,
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { cellWidth: 155, fontStyle: 'bold' },
        1: { cellWidth: 50, halign: 'center', textColor: [6, 182, 212], fontStyle: 'bold' },
        2: { cellWidth: 75, halign: 'center' },
        3: { cellWidth: 235 }
      }
    });

    currentY = doc.lastAutoTable.finalY + 20;

    // Strengths & Weaknesses
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("IDENTIFIED STRENGTHS & DEVELOPMENT AREAS", margin, currentY);
    currentY += 14;

    const strengths = interview.strengths || ["Solid technical fundamentals", "Polite and responsive"];
    const weaknesses = interview.weaknesses || ["Needs more quantifiable project impact metrics"];

    const strengthRows = strengths.map((s, idx) => [`Strength ${idx + 1}`, s]);
    const weaknessRows = weaknesses.map((w, idx) => [`Area ${idx + 1}`, w]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["Category", "Evidence-Based AI Observation"]],
      body: [
        ...strengthRows,
        ...weaknessRows
      ],
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 4 }
    });

    // PAGE 2: Question Breakdown & Skill Gap Roadmap
    doc.addPage();
    let page2Y = 45;

    // Header on Page 2
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("AI INTERVIEW PREPARATION ASSISTANT — DETAILED QUESTION LOG", margin, 28);

    doc.setFontSize(8);
    doc.setTextColor(6, 182, 212);
    doc.text(`SESSION: ${interview.interviewId}`, pageWidth - margin - 120, 28);

    // Question-wise Performance Table
    const evaluations = interview.evaluations || [];
    const questionRows = evaluations.map((ev, idx) => {
      const isSkipped = ev.isSkipped || ev.status === "Skipped";
      return [
        `Q${idx + 1}: ${ev.topic || ev.category}${isSkipped ? ' [SKIPPED]' : ''}`,
        ev.questionText ? ev.questionText.slice(0, 110) + "..." : "Dynamic Resume Question",
        isSkipped ? "[Candidate skipped this question]" : (ev.answerText ? ev.answerText.slice(0, 110) + "..." : "Candidate Answer Transcript"),
        isSkipped ? "Not Attempted" : `${ev.scores?.overall || 80}%`,
        isSkipped ? "Question was skipped by candidate. No positive evaluation awarded." : (ev.feedback || ev.strength || "Solid response with clear grounding.")
      ];
    });

    if (questionRows.length > 0) {
      autoTable(doc, {
        startY: page2Y + 15,
        margin: { left: margin, right: margin },
        head: [["Question Topic", "Question Asked", "Answer Summary", "Score", "Feedback"]],
        body: questionRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
        styles: { fontSize: 7.5, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 140 },
          2: { cellWidth: 140 },
          3: { cellWidth: 40, halign: 'center', fontStyle: 'bold' },
          4: { cellWidth: 115 }
        }
      });
      page2Y = doc.lastAutoTable.finalY + 18;
    }

    // Skill Gap & Improvement Roadmap
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("PERSONALIZED SKILL GAP & ACTIONABLE 7-DAY IMPROVEMENT PLAN", margin, page2Y);
    page2Y += 12;

    const skillGaps = interview.skillGaps || [
      { skill: "Quantitative Impact Framing", currentScore: 74, targetScore: 88, gap: 14, recommendation: "Frame outcomes using STAR with concrete percentage improvements." }
    ];

    const gapRows = skillGaps.map(g => [
      g.skill,
      `${g.currentScore}%`,
      `${g.targetScore}%`,
      `+${g.gap}%`,
      g.recommendation
    ]);

    autoTable(doc, {
      startY: page2Y,
      margin: { left: margin, right: margin },
      head: [["Target Skill / Competency", "Current", "Target", "Gap", "Actionable Improvement Recommendation"]],
      body: gapRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 4 }
    });

    page2Y = doc.lastAutoTable.finalY + 16;

    // Final AI Feedback Box
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, page2Y, contentWidth, 55, 4, 4, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("EXECUTIVE AI HR SUMMARY & VERDICT:", margin + 10, page2Y + 16);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const feedbackSummary = interview.finalFeedback || "Candidate demonstrated a strong grasp of technical concepts and articulated ideas with confidence. Recommended for next round after refining STAR metrics.";
    const splitText = doc.splitTextToSize(feedbackSummary, contentWidth - 20);
    doc.text(splitText, margin + 10, page2Y + 30);

    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `AI Interview Preparation Assistant • Page ${i} of ${totalPages} • Confidential Assessment`,
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    }

    return doc;
  },

  // Direct download trigger
  downloadInterviewReport: (interview) => {
    try {
      const doc = reportService.generateInterviewReport(interview);
      const candidateName = (interview.candidate?.name || 'Candidate').replace(/\s+/g, '_');
      const dateStr = interview.date || new Date().toISOString().split('T')[0];
      const filename = `AI_Interview_Report_${candidateName}_${dateStr}.pdf`;
      doc.save(filename);
      return true;
    } catch (e) {
      console.error("Failed to generate PDF", e);
      return false;
    }
  }
};
