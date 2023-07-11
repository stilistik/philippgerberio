import React from "react";
import { Post, Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import { useIsMobile, useMobileAutoHoverOnScroll } from "~/utils/hooks";
import clx from "classnames";
import { colors } from "~/utils/colors";

interface ContentThumbnailProps {
  content: Post | Project;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ContentThumbnail = ({
  content,
  onMouseEnter,
  onMouseLeave,
}: ContentThumbnailProps) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div className="relative shadow-2xl rounded-2xl overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full -z-10"
        style={{
          backgroundImage: `linear-gradient(-45deg, ${colors[0]} 0%, ${colors[9]} 100%)`,
          opacity: hovered ? 1 : 0,
          transition: `all 200ms ease-in-out`,
        }}
      />
      <div
        className="m-2 p-10 bg-white rounded-xl"
        onMouseEnter={(e) => {
          setHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          onMouseLeave?.(e);
        }}
      >
        {content.thumbnail ? (
          <div className="rounded-md" style={{ background: "#333" }}>
            <img
              src={content.thumbnail}
              className={clx("rounded-md border transition-all duration-1000")}
            />
          </div>
        ) : (
          <div className="rounded-md border shadow-xl w-full h-60 flex items-center justify-center">
            <ImageIcon />
          </div>
        )}
        <div className="mt-5">
          <SubHeader className="text-black font-medium">
            {content.title}
          </SubHeader>
          <p className="text-2xl  text-gray-600">{content.description}</p>
        </div>
      </div>
    </div>
  );
};
