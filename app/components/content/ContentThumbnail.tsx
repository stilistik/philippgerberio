import React from "react";
import { Post, Project, Resource } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import { useMobileAutoHoverOnScroll } from "~/utils/hooks";
import { colors } from "~/utils/colors";
import { FrontImage } from "./FrontImage";

type ContentWithFrontImage = (Post | Project) & {
  frontImage?: Resource;
};

interface ContentThumbnailProps {
  content: ContentWithFrontImage;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ContentThumbnail = ({
  content,
  onMouseEnter,
  onMouseLeave,
}: ContentThumbnailProps) => {
  const [hovered, setHovered] = React.useState(false);
  const ref = useMobileAutoHoverOnScroll(hovered, setHovered);
  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full -z-10 rounded-2xl "
        style={{
          background: `linear-gradient(-45deg, ${colors[0]} 0%, ${colors[9]} 100%)`,
          transform: hovered ? "scale(1)" : "scale(0.95)",
          transition: `all 300ms ease-in-out`,
        }}
      />
      <div className="m-2 p-5 bg-white rounded-xl">
        {content.frontImage ? (
          <FrontImage resource={content.frontImage} />
        ) : (
          <div className="rounded-md border shadow-xl w-full h-60 flex items-center justify-center">
            <ImageIcon />
          </div>
        )}
        <div className="mt-5">
          <SubHeader className="font-medium">{content.title}</SubHeader>
          <p className="text:xl lg:text-2xl  text-gray-600">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
};
