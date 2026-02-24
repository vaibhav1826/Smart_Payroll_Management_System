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
    // Dynamic import to keep bundle lean
    import('jspdf').then(({ jsPDF }) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF();
            const { employee, month, year, basicSalary, hra, da, pf, otherAllowances, overtimePay, grossPay, netPay, presentDays, workingDays, leaveDays } = slip;

            doc.setFontSize(18);
            doc.setTextColor(30, 64, 175);
            doc.text('Shiv Enterprises', 105, 20, { align: 'center' });
            doc.setFontSize(11);
            doc.setTextColor(80);
            doc.text('Salary Slip', 105, 28, { align: 'center' });
            doc.setDrawColor(200);
            doc.line(15, 32, 195, 32);

            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.text(`Employee: ${employee?.name || '—'}`, 15, 40);
            doc.text(`Designation: ${employee?.designation || '—'}`, 15, 47);
            doc.text(`Department: ${employee?.department || '—'}`, 15, 54);
            doc.text(`Pay Period: ${new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`, 120, 40);
            doc.text(`Working Days: ${workingDays}`, 120, 47);
            doc.text(`Present Days: ${presentDays}`, 120, 54);

            doc.autoTable({
                startY: 63,
                head: [['Earnings', 'Amount (₹)', 'Deductions', 'Amount (₹)']],
                body: [
                    ['Basic Salary', basicSalary, 'PF', pf],
                    ['HRA', hra, '', ''],
                    ['DA', da, '', ''],
                    ['Other Allowances', otherAllowances, '', ''],
                    ['Overtime Pay', overtimePay, '', ''],
                ],
                styles: { fontSize: 9 },
                headStyles: { fillColor: [30, 64, 175] },
            });

            const finalY = doc.lastAutoTable.finalY + 8;
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(`Gross Pay: ₹${grossPay}`, 15, finalY);
            doc.text(`Net Pay: ₹${netPay}`, 120, finalY);

            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(120);
            doc.text('This is a computer-generated payslip and does not require a signature.', 105, 285, { align: 'center' });

            doc.save(`SalarySlip_${employee?.name || 'Employee'}_${month}_${year}.pdf`);
        });
    });
}
