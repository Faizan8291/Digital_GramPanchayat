package com.example.demo.utility;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

public class BirthCertificatePdfGenerator {

    public static byte[] generate(String name, Date dateOfBirth, String birthPlace, 
                                   String hospitalName, String certNo) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 24, Font.BOLD);
            Paragraph title = new Paragraph("BIRTH CERTIFICATE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Subtitle
            Font subtitleFont = new Font(Font.HELVETICA, 14, Font.ITALIC);
            Paragraph subtitle = new Paragraph("Gram Panchayat Digital Record", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(30);
            document.add(subtitle);

            // Certificate Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            table.setSpacingBefore(20);
            table.setSpacingAfter(20);

            Font labelFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font valueFont = new Font(Font.HELVETICA, 12, Font.NORMAL);

            // Certificate Number
            addRow(table, "Certificate Number:", certNo, labelFont, valueFont);

            // Name
            addRow(table, "Name:", name, labelFont, valueFont);

            // Date of Birth
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
            String dobString = sdf.format(dateOfBirth);
            addRow(table, "Date of Birth:", dobString, labelFont, valueFont);

            // Place of Birth
            addRow(table, "Place of Birth:", birthPlace != null ? birthPlace : "N/A", labelFont, valueFont);

            // Hospital Name
            addRow(table, "Hospital Name:", hospitalName != null ? hospitalName : "N/A", labelFont, valueFont);

            // Issue Date
            addRow(table, "Issue Date:", sdf.format(new Date()), labelFont, valueFont);

            document.add(table);

            // Footer
            Font footerFont = new Font(Font.HELVETICA, 10, Font.ITALIC);
            Paragraph footer = new Paragraph("\nIssued by Digital Gram Panchayat System", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(40);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF certificate", e);
        }
        
        return out.toByteArray();
    }

    private static void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(PdfPCell.NO_BORDER);
        labelCell.setPadding(8);
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(PdfPCell.NO_BORDER);
        valueCell.setPadding(8);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
