import React from "react";

import ResourcesBook from "./ResourcesBook";
import ResourcesVideo from "./ResourcesVideo";
import ResourceAudio from "./ResourceAudio";

const Resources = () => {
  return (
    <div className="flex justify-around">
      <ResourcesBook />
      <ResourcesVideo/>
      <ResourceAudio/>
    </div>
  );
};

export default Resources;
