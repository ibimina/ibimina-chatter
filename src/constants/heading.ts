import styles from "@/styles/editor.module.css"
const heading = [
    { name: 'Normal', value: '' },
    { name: 'H1', value: '# ' },
    { name: 'H2', value: '## ' },
    { name: 'H3', value: '### ' },
    { name: 'H4', value: '#### ' },
    { name: 'H5', value: '##### ' },
    { name: 'H6', value: '###### ' },]

// Path: src\constants\image.ts
const markdownValues = [
    { name: 'Bullet List', value: '- ', className: styles.bulletList },
    { name: 'Numbered List', value: '1. ', className: styles.numberedList },
    { name: 'Link', value: '[Link Text](https://)', className: styles.link },
    { name: 'Divider', value: '---\n', className: styles.divider },
    { name: 'Code', value: '```code\n\n```', className: styles.code },
    { name: 'Quote', value: '>_hello_ ', className: styles.quote },
    { name: 'Table', value: '| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n', className: styles.table },
    { name: 'Image', value: '![Alt Text](https://image.jpg)', className: styles.image },
    { name: 'Embed Link', value: '[Alt Text](https://youtube.com/embed/video)', className: styles.embedLink },
    { name: 'Bold', value: '**bold**', className: styles.bold },
    { name: 'Italics', value: '*italics*', className: styles.italics },
    { name: 'Task List', value: '- [ ] ', className: styles.tasklist },
    { name: 'Strikethrough', value: '~~strikethrough~~', className: styles.strikethrough },
    { name: 'Superscript', value: '^superscript^', className: styles.superscript },
    { name: 'Subscript', value: '~subscript~', className: styles.subscript },
    { name: 'Inline Code', value: '`inline code`', className: styles.inlineCode },
    { name: 'block quote', value: '>>blockquote', className: styles.blockquote },
    { name: 'Line Break', value: '  \n', className: styles.lineBreak },
]

export { markdownValues, heading }
