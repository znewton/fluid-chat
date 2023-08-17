import React from "react";
import { IAzureAudience } from "@fluidframework/azure-client";
import { IUser } from "../definitions";
import { getHexCodeColorFromString } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IAudienceDisplayProps {
  audience: IAzureAudience | undefined;
  currentUser: IUser;
}

export const AudienceDisplay: React.FunctionComponent<IAudienceDisplayProps> = (
  props: IAudienceDisplayProps
) => {
  const [members, setMembers] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    if (!props.audience) return;
    const updateMembers = () => {
      const allMembers = props.audience.getMembers();
      console.log(allMembers);
      setMembers(new Set(allMembers?.keys() ?? []));
    };
    updateMembers();
    props.audience.on("membersChanged", () => {
      updateMembers();
    });
  }, [props.audience]);

  return (
    <div className="audience">
      {Array.from(members).map((userId) => {
        const userColor = getHexCodeColorFromString(userId);
        const style: React.CSSProperties = {
          backgroundColor: `#${userColor}66`,
        };
        if (userId === props.currentUser.id) {
          style.border = `3px solid #${userColor}`;
        }
        return (
          <div
            className="audience-member"
            key={userId}
            style={style}
            title={userId}
          >
            <FontAwesomeIcon icon={["fas", "user"]} />{" "}
            <span style={{ marginLeft: "0.4em" }}>
              {userId
                .split("-")
                .map((part) => part[0].toUpperCase())
                .join("")}
            </span>
          </div>
        );
      })}
    </div>
  );
};
