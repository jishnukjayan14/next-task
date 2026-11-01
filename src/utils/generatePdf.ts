// Client-side printable PDF / Document generation for Instant Downloads

export function downloadPrintableDocument(title: string, type: string) {
  // Create an elegant printable HTML document in a blob
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Printable Template</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: 'Georgia', serif;
      color: #2d3748;
      margin: 0;
      padding: 24px;
      background: #faf8f5;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #b99484;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      color: #6e5044;
      letter-spacing: 1px;
    }
    .subtitle {
      font-size: 13px;
      color: #718096;
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-title {
      font-size: 14px;
      font-weight: bold;
      color: #866152;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px dashed #cbd5e0;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #edf2f7;
    }
    .checkbox {
      width: 18px;
      height: 18px;
      border: 1.5px solid #a0aec0;
      border-radius: 4px;
    }
    .line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }
    .habit-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .habit-circles {
      display: flex;
      gap: 6px;
    }
    .circle {
      width: 14px;
      height: 14px;
      border: 1px solid #cbd5e0;
      border-radius: 50%;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #a0aec0;
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
    @media print {
      body { background: #ffffff; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div style="text-align: right; margin-bottom: 10px;" class="print-btn">
    <button onclick="window.print()" style="background: #866152; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <h1>${title}</h1>
    <div class="subtitle">Daily Productivity & Habit Printable • Date: _________________</div>
  </div>

  <div class="grid">
    <div>
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-title">Top 3 Priorities for Today</div>
        <div class="todo-item"><div class="checkbox"></div><div class="line"></div></div>
        <div class="todo-item"><div class="checkbox"></div><div class="line"></div></div>
        <div class="todo-item"><div class="checkbox"></div><div class="line"></div></div>
      </div>

      <div class="card">
        <div class="card-title">Daily Task List & Schedule</div>
        ${Array.from({ length: 8 })
          .map(() => `<div class="todo-item"><div class="checkbox"></div><div class="line"></div></div>`)
          .join('')}
      </div>
    </div>

    <div>
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-title">Daily Habits (M T W T F S S)</div>
        <div class="habit-row">
          <span style="font-size: 12px;">💧 2L Water</span>
          <div class="habit-circles">
            ${Array.from({ length: 7 }).map(() => `<div class="circle"></div>`).join('')}
          </div>
        </div>
        <div class="habit-row">
          <span style="font-size: 12px;">📖 Reading (20m)</span>
          <div class="habit-circles">
            ${Array.from({ length: 7 }).map(() => `<div class="circle"></div>`).join('')}
          </div>
        </div>
        <div class="habit-row">
          <span style="font-size: 12px;">🧘 Meditation</span>
          <div class="habit-circles">
            ${Array.from({ length: 7 }).map(() => `<div class="circle"></div>`).join('')}
          </div>
        </div>
        <div class="habit-row">
          <span style="font-size: 12px;">🏃 Workout</span>
          <div class="habit-circles">
            ${Array.from({ length: 7 }).map(() => `<div class="circle"></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Gratitude & Notes</div>
        <div style="height: 120px; border-bottom: 1px dashed #e2e8f0; margin-bottom: 8px;"></div>
        <div style="height: 120px;"></div>
      </div>
    </div>
  </div>

  <div class="footer">
    Crafted with care • Stationery & Productivity Store • Instant Printable Edition
  </div>
</body>
</html>
  `;

  // Create blob and trigger download or open print preview
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_printable.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
