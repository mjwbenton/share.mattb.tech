import * as React from "react";
import Recording from "./Recording";
import EmbeddedWrapper from "../component/EmbeddedWrapper";
import { usePageData } from "@mattb.tech/data-fetching";

const SingleRecording: React.FunctionComponent = () => {
  const {
    recording,
  }: { recording: { name: string; url: string } | undefined } = usePageData();
  if (!recording) {
    return null;
  }
  return (
    <EmbeddedWrapper>
      <Recording url={recording.url} name={recording.name} />
    </EmbeddedWrapper>
  );
};
export default SingleRecording;
