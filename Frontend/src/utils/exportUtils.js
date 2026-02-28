import * as XLSX from 'xlsx';

export function exportCSV(rows, filename = 'export.csv') {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename.replace(/\.csv$/, '.csv'));
}

export function exportExcel(rows, filename = 'export.xlsx', sheetName = 'Report') {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
}

export function exportSalarySlipPDF(slip) {
    import('jspdf').then(({ jsPDF }) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF();
            const { employee, month, year, basicSalary, hra, da, regularBonuses, pf, esi, tds, advancePayment, emiAdjustments, grossPay, netPay, totalDeductions, presentDays, workingDays } = slip;

            const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

            // ── Company Header ──
            doc.setFillColor(30, 64, 175);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255);
            doc.setFontSize(22);
            doc.setFont(undefined, 'bold');
            doc.text('SHIV ENTERPRISES', 105, 20, { align: 'center' });
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('123 Corporate Avenue, Tech District, City - 400001', 105, 28, { align: 'center' });

            // ── Title ──
            doc.setTextColor(50);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`PAYSLIP FOR THE MONTH OF ${monthName.toUpperCase()}`, 105, 52, { align: 'center' });

            // ── Employee Details Card ──
            doc.setDrawColor(200);
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(14, 60, 182, 35, 3, 3, 'FD');

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(60);

            // Left Col
            doc.text('Employee Name:', 20, 70);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0); doc.text(employee?.name || '—', 55, 70);

            doc.setFont(undefined, 'normal'); doc.setTextColor(60);
            doc.text('Designation:', 20, 78);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0); doc.text(employee?.designation || '—', 55, 78);

            doc.setFont(undefined, 'normal'); doc.setTextColor(60);
            doc.text('Department:', 20, 86);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0); doc.text(employee?.department || '—', 55, 86);

            // Right Col
            doc.setFont(undefined, 'normal'); doc.setTextColor(60);
            doc.text('Date of Joining:', 110, 70);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0);
            doc.text(employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '—', 145, 70);

            doc.setFont(undefined, 'normal'); doc.setTextColor(60);
            doc.text('Bank Name:', 110, 78);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0); doc.text(employee?.bankDetails?.bankName || '—', 145, 78);

            doc.setFont(undefined, 'normal'); doc.setTextColor(60);
            doc.text('A/C Number:', 110, 86);
            doc.setFont(undefined, 'bold'); doc.setTextColor(0); doc.text(employee?.bankDetails?.accountNumber || '—', 145, 86);

            // ── Attendance Details ──
            doc.autoTable({
                startY: 102,
                margin: { left: 14, right: 14 },
                head: [['Total Working Days', 'Present Days', 'Payable Days', 'Status']],
                body: [[workingDays, presentDays, presentDays, 'Processed']],
                theme: 'grid',
                headStyles: { fillColor: [243, 244, 246], textColor: [55, 65, 81], fontSize: 9, halign: 'center', fontStyle: 'bold' },
                bodyStyles: { fontSize: 10, halign: 'center', textColor: 0 },
            });

            // ── Salary Computation (Split Table) ──
            const earnings = [
                ['Basic Salary', basicSalary],
                ['House Rent Allowance (HRA)', hra],
                ['Dearness Allowance (DA)', da],
                ['Regular Bonuses', regularBonuses]
            ];

            const deductions = [
                ['Provident Fund (PF)', pf],
                ['Employee State Insurance (ESI)', esi],
                ['Tax Deducted at Source (TDS)', tds],
                ['Advance / Loan EMI', advancePayment + emiAdjustments]
            ];

            // Balance the rows visually
            let maxRows = Math.max(earnings.length, deductions.length);
            let mergedBody = [];
            for (let i = 0; i < maxRows; i++) {
                mergedBody.push([
                    earnings[i] ? earnings[i][0] : '',
                    earnings[i] ? `Rs. ${Number(earnings[i][1]).toLocaleString('en-IN')}` : '',
                    deductions[i] ? deductions[i][0] : '',
                    deductions[i] ? `Rs. ${Number(deductions[i][1]).toLocaleString('en-IN')}` : ''
                ]);
            }

            // Push Gross Totals as last row
            mergedBody.push([
                { content: 'Gross Earnings', styles: { fontStyle: 'bold' } },
                { content: `Rs. ${Number(grossPay).toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } },
                { content: 'Total Deductions', styles: { fontStyle: 'bold' } },
                { content: `Rs. ${Number(totalDeductions).toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }
            ]);

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 8,
                margin: { left: 14, right: 14 },
                head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
                body: mergedBody,
                theme: 'grid',
                headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 10, fontStyle: 'bold' },
                bodyStyles: { fontSize: 9, textColor: 20 },
                columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' } },
            });

            // ── Final Net Pay Block ──
            const finalY = doc.lastAutoTable.finalY + 12;
            doc.setFillColor(240, 253, 244);
            doc.setDrawColor(187, 247, 208);
            doc.rect(14, finalY, 182, 16, 'FD');

            doc.setFontSize(11);
            doc.setTextColor(22, 101, 52);
            doc.setFont(undefined, 'bold');
            doc.text('NET PAY (take-home percentage):', 20, finalY + 10);

            doc.setFontSize(14);
            doc.text(`Rs. ${Number(netPay).toLocaleString('en-IN')}`, 190, finalY + 10, { align: 'right' });

            // ── Authorization & Footer ──
            doc.setFontSize(9);
            doc.setTextColor(80);
            doc.setFont(undefined, 'normal');
            doc.text('System Generated Document', 14, 275);

            doc.setDrawColor(150);
            doc.line(140, 268, 196, 268);
            doc.text('Authorized Signatory', 168, 274, { align: 'center' });
            doc.text('Shiv Enterprises HR', 168, 279, { align: 'center' });

            let saveName = `Payslip_${employee?.name ? employee.name.replace(/\s+/g, '_') : 'Employee'}_${month}_${year}.pdf`;
            doc.save(saveName);
        });
    });
}
