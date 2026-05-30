import React, { PropsWithChildren } from "react";

function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}

export default DefaultLayout;
