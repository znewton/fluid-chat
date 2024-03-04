import React from "react";
import { AzureMember, IAzureAudience } from "@fluidframework/azure-client";
import { RiUserFill } from "react-icons/ri";
import { IUser } from "../definitions";
import { getHexCodeColorFromString } from "../utils";

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
      setMembers(
        new Set(Array.from(allMembers.entries()).map(([, m]) => m.userId))
      );
    };
    const memberAddListener = (clientId: string, member: AzureMember) => {
      console.log("Audience Member Added: ", member.userId);
      updateMembers();
    };
    props.audience.on("memberAdded", memberAddListener);
    const memberRemoveListener = (clientId: string, member: AzureMember) => {
      console.log("Audience Member Removed: ", member.userId);
      updateMembers();
    };
    props.audience.on("memberRemoved", memberRemoveListener);
    return () => {
      props.audience.off("memberAdded", memberAddListener);
      props.audience.off("memberRemoved", memberRemoveListener);
    };
  }, [props.audience]);

  React.useEffect(() => {
    console.log("Audience Loaded: ", Array.from(members).toString());
  }, [members]);

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
            <RiUserFill />{" "}
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
