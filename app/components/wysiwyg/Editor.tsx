import ExampleTheme from "./themes/Theme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import { ImageNode } from "./nodes/ImageNode";
import { LexicalEditor, $getRoot, $insertNodes } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import React from "react";
import { EditorRefPlugin } from "./plugins/EditorRefPlugin";
import { Resource } from "@prisma/client";

function Placeholder() {
  return <div className="editor-placeholder">Start typing</div>;
}

const editorConfig = {
  theme: ExampleTheme,
  onError: (e) => {
    throw e;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
};

export interface EditorProps {
  content: string;
  resources: Resource[];
}

export interface EditorImperativeHandle {
  getContent: () => Promise<string>;
}

export const Editor = React.forwardRef<EditorImperativeHandle, EditorProps>(
  ({ content = "", resources = [] }, ref) => {
    const innerRef = React.useRef<LexicalEditor | null>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        getContent: () => {
          return new Promise((resolve) => {
            const editor = innerRef.current;
            if (!editor) return resolve("");
            const state = editor.getEditorState();
            state.read(() => {
              const htmlString = $generateHtmlFromNodes(editor, null);
              resolve(htmlString);
            });
          });
        },
      }),
      []
    );

    React.useEffect(() => {
      const editor = innerRef.current;
      editor?.update(() => {
        console.log(content);

        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);

        // Select the root
        $getRoot().select();

        // Insert them at a selection.
        $insertNodes(nodes);
      });
    }, []);

    return (
      <LexicalComposer initialConfig={{ ...editorConfig }}>
        <div className="editor-container">
          <ToolbarPlugin resources={resources} />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ImagesPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <EditorRefPlugin editorRef={innerRef} />
          </div>
        </div>
      </LexicalComposer>
    );
  }
);
