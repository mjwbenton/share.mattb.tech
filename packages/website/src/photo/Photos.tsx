import { PhotoFragment } from "generated/graphql";
import Photo from "./Photo";
import chunk from "lodash.chunk";
import theme from "style/theme.preval";

export type PhotosLayout = "default" | "one_two" | "vertical_half";

export default function Photos({
  photos,
  layout = "default",
}: {
  photos: ReadonlyArray<PhotoFragment>;
  layout?: PhotosLayout;
}) {
  if (layout === "one_two") {
    return (
      <PhotosWrapper>
        {chunk(photos, 3).map(([p1, p2, p3], i) => (
          <div
            key={p1.pageUrl}
            className="flex flex-col w-full items-start space-y-2"
          >
            <Photo {...p1} lazyLoad={i > 0} />
            <div className="flex flex-col w-full lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
              <div className="flex self-start w-[75vw] lg:w-[50vw]">
                {p2 && (
                  <Photo
                    {...p2}
                    lazyLoad={i > 0}
                    sizes={`(min-width: ${theme.screens["lg"]}) 50vw, 75vw`}
                  />
                )}
              </div>
              <div className="flex self-end w-[75vw] lg:w-[50vw]">
                {p3 && (
                  <Photo
                    {...p3}
                    lazyLoad={i > 0}
                    sizes={`(min-width: ${theme.screens["lg"]}) 50vw, 75vw`}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </PhotosWrapper>
    );
  } else if (layout === "vertical_half") {
    const rows = verticalHalfOrganisePhotoRows(photos);
    return (
      <PhotosWrapper>
        {rows.map((row, i) => {
          const [p1, p2] = row;
          if (!p2) {
            return <Photo key={p1.pageUrl} {...p1} lazyLoad={i > 0} />;
          } else {
            return (
              <div
                key={p1.pageUrl}
                className="flex flex-col flex-wrap space-y-16 md:space-y-0 md:flex-row md:space-x-8 md:mx-8"
              >
                <div className="min-w-0 md:max-w-[calc(50vw-theme(spacing.12))]">
                  <Photo {...p1} lazyLoad={i > 0} />
                </div>
                <div className="min-w-0 md:max-w-[calc(50vw-theme(spacing.12))]">
                  <Photo {...p2} lazyLoad={i > 0} />
                </div>
              </div>
            );
          }
        })}
      </PhotosWrapper>
    );
  } else {
    return (
      <PhotosWrapper>
        {photos.map((p, i) => (
          <Photo {...p} key={p.pageUrl} lazyLoad={i > 0} />
        ))}
      </PhotosWrapper>
    );
  }
}

export function PhotosWrapper(
  props: Omit<JSX.IntrinsicElements["div"], "className"> & {
    marginless?: boolean;
  },
) {
  // Marginless removes all margins from the PhotoWrapper and uses negative margins to push the wrapper to the edge of the screen
  const { marginless, ...rest } = props;
  return (
    <div
      {...rest}
      className={`not-prose flex flex-col items-start w-screen -mx-4 md:-mx-8 space-y-16 ${marginless ? "-my-4 md:-my-8" : "my-16"}`}
    />
  );
}

function verticalHalfOrganisePhotoRows(photos: ReadonlyArray<PhotoFragment>) {
  const rows: Array<[PhotoFragment] | [PhotoFragment, PhotoFragment]> = [];
  for (const photo of photos) {
    // If the photo is landscape it gets its own row
    if (photo.mainSource.width > photo.mainSource.height) {
      rows.push([photo]);
    } else {
      // If its a portrait photo, then we need to check if it can fit into the last row
      const lastRow = rows[rows.length - 1];
      const lastRowPhoto = lastRow?.[0];
      if (
        lastRow?.length === 1 &&
        lastRowPhoto?.mainSource.height > lastRowPhoto.mainSource.width
      ) {
        rows[rows.length - 1].push(photo);
      } else {
        rows.push([photo]);
      }
    }
  }
  return rows;
}
