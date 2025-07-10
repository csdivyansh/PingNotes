const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle } = require('docx');
const fs = require('fs');

async function convertMarkdownToWord() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync('PINGNOTES_API_DOCUMENTATION.md', 'utf8');
    
    // Split content into lines
    const lines = markdownContent.split('\n');
    
    const children = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '') continue;
      
      // Handle headers
      if (line.startsWith('# ')) {
        children.push(
          new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
      } else if (line.startsWith('## ')) {
        children.push(
          new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
      } else if (line.startsWith('### ')) {
        children.push(
          new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 250, after: 100 }
          })
        );
      } else if (line.startsWith('#### ')) {
        children.push(
          new Paragraph({
            text: line.substring(5),
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          })
        );
      } else if (line.startsWith('|')) {
        // Handle tables
        const tableRows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          const tableLine = lines[i].trim();
          if (tableLine === '|') break;
          
          const cells = tableLine.split('|').slice(1, -1).map(cell => cell.trim());
          tableRows.push(cells);
          i++;
        }
        i--; // Go back one line since the loop will increment
        
        if (tableRows.length > 0) {
          const table = new Table({
            rows: tableRows.map((row, rowIndex) => {
              return new TableRow({
                children: row.map(cell => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell,
                            size: 20
                          })
                        ]
                      })
                    ],
                    width: { size: 2000, type: 'dxa' }
                  });
                })
              });
            })
          });
          children.push(table);
        }
      } else if (line.startsWith('```')) {
        // Handle code blocks
        let codeContent = '';
        i++; // Skip the opening ```
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeContent.trim(),
                font: 'Courier New',
                size: 18,
                color: '2E2E2E'
              })
            ],
            spacing: { before: 100, after: 100 }
          })
        );
      } else if (line.startsWith('- ')) {
        // Handle bullet points
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ' + line.substring(2),
                size: 22
              })
            ],
            spacing: { before: 50, after: 50 }
          })
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Handle bold text
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                bold: true,
                size: 22
              })
            ],
            spacing: { before: 100, after: 100 }
          })
        );
      } else {
        // Regular paragraph
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 22
              })
            ],
            spacing: { before: 50, after: 50 }
          })
        );
      }
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    // Generate the Word document
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('PINGNOTES_API_DOCUMENTATION.docx', buffer);
    
    console.log('✅ Successfully converted PINGNOTES_API_DOCUMENTATION.md to PINGNOTES_API_DOCUMENTATION.docx');
    
  } catch (error) {
    console.error('❌ Error converting file:', error);
  }
}

convertMarkdownToWord(); 