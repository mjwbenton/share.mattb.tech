import React from "react";
import Icon from "./Icon";
import { Share } from "react-feather";
import { NoShareMode } from "utils/isShareMode";

const Infoline = ({
  externalLinkUrl,
  externalLinkText,
  shareUrl,
  children,
}: {
  externalLinkUrl?: string;
  externalLinkText?: string;
  shareUrl?: string;
  children: any;
}) => (
  <div className="flex text-xs bg-light-1 dark:bg-dark-1 max-w-[inherit]">
    <div className="p-2 flex-1 min-w-0">{children}</div>
    {shareUrl ? (
      <NoShareMode>
        <a className="block flex-none p-2 min-w-14 text-center" href={shareUrl}>
          Sh <Icon component={Share} size="xsmall" />
        </a>
      </NoShareMode>
    ) : null}
    {externalLinkUrl ? (
      <NoShareMode>
        <a
          className="block flex-none p-2 min-w-14 text-center external-link"
          href={externalLinkUrl}
        >
          {externalLinkText}
        </a>
      </NoShareMode>
    ) : null}
  </div>
);

export default Infoline;
