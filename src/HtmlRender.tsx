import React from "react";

interface Props {
  template?: string | undefined;
}

function HtmlRender({ template }: Props) {
  return (
    <div
      id="text-to-copy"
      className="mx-auto bg-white shadow-widget border rounded-sm"
      dangerouslySetInnerHTML={{ __html: template ?? "" }}
    ></div>
  );
}

export default React.memo(HtmlRender);
