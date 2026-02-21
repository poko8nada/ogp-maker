---
title: Markdown syntax guide
createdAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD
version: 1
isPublished: false
tags:
  - Next.js
  - markdown
  - diary
  - program
  - design
  - bugfix
---

## Headers

## This is a Heading h2

### This is a Heading h3

#### This is a Heading h4

##### This is a Heading h5

###### This is a Heading h6

## Emphasis

_This text will be italic_  
_This will also be italic_

**This text will be bold**  
**This will also be bold**

_You **can** combine them_

## Lists

### Unordered

- Item 1
- Item 2
- Item 2a
- Item 2b
  - Item 3a
  - Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
   1. Item 3a
   2. Item 3b

## Images

![Test Image](/api/images/sample01.png)

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
> > Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Blocks of code

```
let message = 'Hello world';
alert(message);
```

## Inline code

This web site is using `markedjs/marked`.
