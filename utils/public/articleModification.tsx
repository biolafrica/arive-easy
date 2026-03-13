import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";


interface TextSection {
  type: 'text';
  content: string | string[];
  heading?: string;
  subheading?: string;
}

interface ImageSection {
  type: 'image';
  src: string;
  alt: string;
}

interface CodeSection {
  type: 'code';
  language: string;
  code: string;
}

interface ListSection {
  type: 'list';
  items: string[];
  ordered: boolean;
}

type Section = TextSection | ImageSection | CodeSection | ListSection;

interface CurrentSection {
  type: 'text' | 'list';
  content?: string[];
  heading?: string;
  subheading?: string;
  items?: string[];
  ordered?: boolean;
}

interface LinkPart {
  type: 'link';
  text: string;
  url: string;
}

interface TextPart {
  type: 'text';
  content: string;
}

type ParsedPart = LinkPart | TextPart;

export const parseContent = (content: string): Section[] => {
  if (!content) return [];

  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: CurrentSection = { type: 'text', content: [] };
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';

  const saveCurrentSection = (): void => {
    if (currentSection.type === 'list' && Array.isArray(currentSection.items) && currentSection.items.length > 0) {
      sections.push({
        type: 'list',
        items: currentSection.items,
        ordered: currentSection.ordered || false
      });
    } else if (currentSection.type === 'text') {
      // Save even if content is empty but has heading/subheading
      if (currentSection.heading || currentSection.subheading || 
          (Array.isArray(currentSection.content) && currentSection.content.length > 0)) {
        sections.push({
          type: 'text',
          content: Array.isArray(currentSection.content) ? currentSection.content.join('\n').trim() : '',
          heading: currentSection.heading,
          subheading: currentSection.subheading
        });
      }
    }
  };

  lines.forEach((line) => {
    // Check for code block start/end
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.trim().substring(3).trim() || 'code';
        codeContent = [];
        
        saveCurrentSection();
        currentSection = { type: 'text', content: [] };
      } else {
        inCodeBlock = false;
        sections.push({
          type: 'code',
          language: codeLanguage,
          code: codeContent.join('\n')
        });
        codeContent = [];
        currentSection = { type: 'text', content: [] };
      }
      return;
    }

    // If in code block, collect code lines
    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Check for headers (### Subheading)
    if (line.trim().startsWith('###')) {
      saveCurrentSection();
      
      currentSection = {
        type: 'text',
        subheading: line.trim().substring(3).trim(),
        content: []
      };
      return;
    } 
    
    // Check for headers (## Heading)
    if (line.trim().startsWith('##')) {
      saveCurrentSection();
      
      currentSection = {
        type: 'text',
        heading: line.trim().substring(2).trim(),
        content: []
      };
      return;
    }

    // Check for numbered lists (1. Item)
    if (line.trim().match(/^\d+\.\s+/)) {
      if (currentSection.type === 'text' && 
          (currentSection.heading || currentSection.subheading || 
           (Array.isArray(currentSection.content) && currentSection.content.length > 0))) {
        saveCurrentSection();
      }
      
      if (currentSection.type !== 'list') {
        currentSection = { type: 'list', items: [], ordered: true };
      }

      const item = line.trim().replace(/^\d+\.\s+/, '');
      if (!Array.isArray(currentSection.items)) {
        currentSection.items = [];
      }
      currentSection.items.push(item);
      return;
    }

    // Check for bullet lists (- Item or * Item)
    if (line.trim().match(/^[-*]\s+/)) {
      if (currentSection.type === 'text' && 
          (currentSection.heading || currentSection.subheading || 
           (Array.isArray(currentSection.content) && currentSection.content.length > 0))) {
        saveCurrentSection();
      }
      
      if (currentSection.type !== 'list') {
        currentSection = { type: 'list', items: [], ordered: false };
      }
      
      const item = line.trim().replace(/^[-*]\s+/, '');
      if (!Array.isArray(currentSection.items)) {
        currentSection.items = [];
      }
      currentSection.items.push(item);
      return;
    }

    // Regular text line
    if (line.trim()) {
      if (currentSection.type === 'list') {
        if (Array.isArray(currentSection.items) && currentSection.items.length > 0) {
          sections.push({
            type: 'list',
            items: currentSection.items,
            ordered: currentSection.ordered || false
          });
        }
        currentSection = { type: 'text', content: [] };
      }
      
      if (!Array.isArray(currentSection.content)) {
        currentSection.content = [];
      }
      
      currentSection.content.push(line);
    } else if (Array.isArray(currentSection.content) && currentSection.content.length > 0) {
      currentSection.content.push('');
    }
  });

  saveCurrentSection();

  return sections;
};

export const renderSection = (section: Section, index: number): ReactNode => {
  if (!section || !section.type) return null;

  const parseInlineMarkdown = (text: string): ReactNode => {
    if (!text) return text;
    
    // Parse links first [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const textWithLinks: ParsedPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        textWithLinks.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      textWithLinks.push({ type: 'link', text: match[1], url: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      textWithLinks.push({ type: 'text', content: text.substring(lastIndex) });
    }
    if (textWithLinks.length === 0) {
      textWithLinks.push({ type: 'text', content: text });
    }

    // Now parse bold in each part
    return textWithLinks.map((part, idx) => {
      if (part.type === 'link') {
        return (
          <Link
            key={`link-${idx}`}
            href={part.url}
            className="text-accent hover:text-accent-hover underline font-medium transition-colors"
            target={part.url.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
          >
            {parseInlineMarkdown(part.text)}
          </Link>
        );
      }

      // Parse bold **text**
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const segments: (string | React.JSX.Element)[] = [];
      let textLastIndex = 0;
      let boldMatch: RegExpExecArray | null;

      while ((boldMatch = boldRegex.exec(part.content)) !== null) {
        if (boldMatch.index > textLastIndex) {
          segments.push(part.content.substring(textLastIndex, boldMatch.index));
        }
        segments.push(<strong key={`bold-${idx}-${boldMatch.index}`} className="font-semibold text-heading">{boldMatch[1]}</strong>);
        textLastIndex = boldMatch.index + boldMatch[0].length;
      }
      if (textLastIndex < part.content.length) {
        segments.push(part.content.substring(textLastIndex));
      }

      return segments.length > 0 ? segments : part.content;
    });
  };

  switch (section.type) {
    
    case 'text':
      return (
        <div key={index} className="mb-8">
          {section.heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
              {section.heading}
            </h2>
          )}
          {section.subheading && (
            <h3 className="text-xl md:text-2xl font-semibold text-heading mb-3">
              {section.subheading}
            </h3>
          )}
          {section.content && typeof section.content === 'string' && section.content.trim() && (
            <div className="text-text leading-relaxed text-base md:text-lg space-y-4">
              {section.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmedParagraph = paragraph.trim();
                if (!trimmedParagraph) return null;
                return (
                  <p key={pIdx}>{parseInlineMarkdown(trimmedParagraph)}</p>
                );
              })}
            </div>
          )}
        </div>
      );

    case 'image':
      return (
        <div key={index} className="mb-8 md:mb-12 rounded-2xl overflow-hidden">
          <div className="bg-card dark:bg-hover rounded-xl overflow-hidden shadow-2xl relative w-full aspect-video">
            <Image 
              src={section.src} 
              alt={section.alt || 'Blog image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhIVFRUXFRUVFxUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKMBNwMBIgACEQEDEQH..."
            />
          </div>
        </div>
      );

    case 'code':
      return (
        <div key={index} className="mb-8">
          <div className="bg-hover dark:bg-active rounded-xl overflow-hidden shadow-lg border border-separator">
            <div className="flex items-center justify-between px-4 py-2 bg-active dark:bg-hover border-b border-separator">
              <span className="text-xs text-secondary uppercase tracking-wide">
                {section.language || 'code'}
              </span>
              <button
                onClick={() => {
                  if (navigator.clipboard && section.code) {
                    navigator.clipboard.writeText(section.code);
                  }
                }}
                className="text-xs text-secondary hover:text-heading transition-colors px-2 py-1 rounded hover:bg-hover dark:hover:bg-active"
              >
                Copy
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-x-auto">
              <pre className="text-sm md:text-base">
                <code className="text-text font-mono leading-relaxed whitespace-pre">
                  {section.code || ''}
                </code>
              </pre>
            </div>
          </div>
        </div>
      );

    case 'list':
      if (!Array.isArray(section.items) || section.items.length === 0) return null;
      
      const ListTag = section.ordered ? 'ol' : 'ul';
      const listClass = section.ordered 
        ? "space-y-3 ml-6 list-decimal" 
        : "space-y-3 ml-6 list-disc";

      return (
        <div key={index} className="mb-8">
          <ListTag className={listClass}>
            {section.items.map((item, i) => (
              <li key={i} className="text-text leading-relaxed text-base md:text-lg pl-2">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ListTag>
        </div>
      );

    default:
      return null;
  }
};

export const insertImagesIntoSections = (sections: Section[], images: string[]): Section[] => {
  console.log('Inserting images into sections:', { sections, images });
  if (!images || images.length === 0) return sections;

  const result: Section[] = [];
  const totalSections = sections.length;
  const imageCount = images.length;

  // Insert first image at the top (before any content)
  if (imageCount >= 1) {
    result.push({
      type: 'image',
      src: images[0],
      alt: 'Featured image'
    });
  }

  // If there's only one image, we're done
  if (imageCount === 1) {
    return [...result, ...sections];
  }

  // For remaining images (2nd, 3rd, etc.), use the default distribution logic
  const remainingImages = images.slice(1); // Get images from index 1 onwards
  const remainingImageCount = remainingImages.length;

  // Calculate positions to insert remaining images
  const insertPositions: number[] = [];
  
  if (remainingImageCount === 1) {
    // Insert after ~1/2 of content (middle)
    insertPositions.push(Math.floor(totalSections / 2));
  } else if (remainingImageCount === 2) {
    // Insert after ~1/3 and ~2/3 of content
    insertPositions.push(Math.floor(totalSections / 3));
    insertPositions.push(Math.floor((totalSections * 2) / 3));
  } else if (remainingImageCount >= 3) {
    // Insert after ~1/4, ~1/2, and ~3/4 of content
    insertPositions.push(Math.floor(totalSections / 4));
    insertPositions.push(Math.floor(totalSections / 2));
    insertPositions.push(Math.floor((totalSections * 3) / 4));
  }

  let imageIndex = 0;
  sections.forEach((section, index) => {
    result.push(section);
    
    // Insert remaining images if this is an insertion point
    if (insertPositions.includes(index + 1) && imageIndex < remainingImages.length) {
      result.push({
        type: 'image',
        src: remainingImages[imageIndex],
        alt: `Blog image ${imageIndex + 2}` // +2 because first image is already used
      });
      imageIndex++;
    }
  });

  return result;
};