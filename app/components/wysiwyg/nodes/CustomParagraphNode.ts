import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  ParagraphNode,
  SerializedParagraphNode,
  Spread,
} from "lexical";

function convertParagraphElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLParagraphElement) {
    const { className } = domNode;
    const node = $createCustomParagraphNode({ className });
    return { node };
  }
  return null;
}

export type SerializedCustomParagraphNode = Spread<
  { className?: string },
  SerializedParagraphNode
>;

export class CustomParagraphNode extends ParagraphNode {
  __className: string;

  static getType(): string {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__className, node.__key);
  }

  static importJSON(
    serializedNode: SerializedCustomParagraphNode
  ): CustomParagraphNode {
    const { className } = serializedNode;
    const node = $createCustomParagraphNode({ className });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      p: () => ({
        conversion: convertParagraphElement,
        priority: 1,
      }),
    };
  }

  constructor(className?: string, key?: NodeKey) {
    super(key);
    this.__className = className ?? "";
  }

  setClassName(cls: string) {
    const writable = this.getWritable();
    writable.__className = cls;
  }

  exportJSON(): SerializedCustomParagraphNode {
    return {
      ...super.exportJSON(),
      className: this.__className,
      type: CustomParagraphNode.getType(),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("p");
    element.setAttribute("class", this.__className);
    return { element };
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("p");
    dom.setAttribute("class", this.__className);
    return dom;
  }

  updateDOM(prevNode: CustomParagraphNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    dom.setAttribute("class", this.__className);
    return false;
  }
}

export function $createCustomParagraphNode({
  className,
  key,
}: {
  className?: string;
  key?: NodeKey;
}): CustomParagraphNode {
  return new CustomParagraphNode(className, key);
}

export function $isCustomParagraphNode(
  node: LexicalNode | null | undefined
): node is CustomParagraphNode {
  return node instanceof CustomParagraphNode;
}
