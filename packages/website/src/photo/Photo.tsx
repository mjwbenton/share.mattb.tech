import * as React from "react";
import Infoline from "../component/Infoline";
import LazyLoad from "react-lazyload";
import gql from "graphql-tag";
import { PhotoFragment } from "generated/graphql";
import { Camera } from "react-feather";
import Icon from "component/Icon";

const DEFAULT_SIZES = `100vw`;

const Photo: React.FunctionComponent<
  PhotoFragment & { lazyLoad?: boolean; sizes?: string }
> = ({
  id,
  pageUrl,
  sources,
  mainSource,
  title,
  lazyLoad,
  sizes = DEFAULT_SIZES,
  camera,
  lens,
  film,
}) => {
  const img = (
    <img
      src={mainSource.url}
      srcSet={generateSrcSet(sources)}
      sizes={sizes}
      alt={`Image titled "${title}"`}
      className="block max-w-full max-h-90vh"
    />
  );
  return (
    <div data-testid="photo-content-block" className="max-w-full" tabIndex={0}>
      {lazyLoad ? (
        <LazyLoad once offset={200} placeholder={<div className="h-64" />}>
          {img}
        </LazyLoad>
      ) : (
        img
      )}
      <Infoline
        externalLinkUrl={pageUrl}
        externalLinkText="Fl"
        shareUrl={`https://share.mattb.tech/photo?p=${id}`}
      >
        <div className="space-y-2">
          <h2 className="font-bold whitespace-nowrap overflow-clip text-ellipsis">
            {title}
          </h2>
          {camera?.name || lens?.name ? (
            <div className="whitespace-nowrap overflow-clip text-ellipsis">
              <Icon component={Camera} size="small" />
              {[
                camera?.name,
                lens?.name !== camera?.name ? lens?.name : undefined,
                film?.name,
              ]
                .filter(Boolean)
                .join(" / ")}
            </div>
          ) : null}
        </div>
      </Infoline>
    </div>
  );
};
export default Photo;

function generateSrcSet(sources: PhotoFragment["sources"]): string {
  return sources
    .map((source) => [source.url, " ", source.width, "w"].join(""))
    .join(", ");
}

export const fragment = gql`
  fragment Photo on Photo {
    id
    pageUrl
    title
    mainSource {
      url
      width
      height
    }
    sources {
      url
      width
      height
    }
    camera {
      name
    }
    lens {
      name
    }
    film {
      name
    }
  }
`;
