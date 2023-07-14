import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import * as React from "react";
import { Suspense } from "react";

const VideoComponent = React.lazy(
  // @ts-ignore
  () => import("./VideoComponent")
);

export interface VideoPayload {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  key?: NodeKey;
}

function convertVideoElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLVideoElement) {
    const { controls, width, height } = domNode;
    const sourceELement = domNode.getElementsByTagName("source")[0];
    const { src } = sourceELement;

    const node = $createVideoNode({ src, width, height, controls });
    return { node };
  }
  return null;
}

export type SerializedVideoNode = Spread<
  {
    src: string;
    width?: number;
    height?: number;
    controls?: boolean;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __controls: boolean;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__width,
      node.__height,
      node.__controls,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { src, width, height, controls } = serializedNode;
    const node = $createVideoNode({
      src,
      width,
      height,
      controls,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("video");
    const source = document.createElement("source");
    source.setAttribute("src", this.__src);
    element.appendChild(source);
    element.setAttribute("controls", "true");
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: (node: Node) => ({
        conversion: convertVideoElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    width?: "inherit" | number,
    height?: "inherit" | number,
    controls?: boolean,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__controls = controls || false;
  }

  exportJSON(): SerializedVideoNode {
    return {
      src: this.getSrc(),
      width: this.__width === "inherit" ? 0 : this.__width,
      height: this.__height === "inherit" ? 0 : this.__height,
      controls: this.__controls ?? false,
      type: "video",
      version: 1,
    };
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <VideoComponent
          src={this.__src}
          width={this.__width}
          height={this.__height}
          controls={this.__controls}
          nodeKey={this.getKey()}
        />
      </Suspense>
    );
  }
}

export function $createVideoNode({
  src,
  width,
  height,
  controls = true,
  key,
}: VideoPayload): VideoNode {
  return $applyNodeReplacement(
    new VideoNode(src, width, height, controls, key)
  );
}

export function $isVideoNode(
  node: LexicalNode | null | undefined
): node is VideoNode {
  return node instanceof VideoNode;
}
