import { IMessage, IMessageSource } from "../../types";
import { deleteEverything } from "../reset";
import changesPrimaryIdOnCreate from "./changes-primary-id-on-create";
import createUser from "./creates-user";
import deletesId from "./deletes-id";
import disablesId from "./disables-id";
import doesNotDeleteIfEnabled from "./does-not-delete-if-enabled";
import enablesId from "./enables-id";
import setsCustomDomain from "./sets-custom-domain";
import switchPrimaryId from "./switches-primary-id";
import addAdmin from "./add-admin";
import addUser from "./add-user";
import removeUser from "./remove-user";
import cannotRemoveOneself from "./cannot-remove-oneself";

export function createMessage(msg: any): IMessage {
  const base = {
    id: "some-message-id",
    root: "some-root",
    sender: "jeswins-user-id",
    text: "hello world",
    timestamp: Date.now()
  };

  return { ...base, ...msg };
}

export default function run(msgSource: IMessageSource) {
  describe("auth", async () => {
    beforeEach(deleteEverything);

    it("creates a user", createUser(msgSource));

    it(
      "changes primary id when a new user is created",
      changesPrimaryIdOnCreate(msgSource)
    );

    it("switches the primary id", switchPrimaryId(msgSource));

    it("disables an id", disablesId(msgSource));

    it("disables an id", enablesId(msgSource));

    it("deletes an id", deletesId(msgSource));

    it("does not deletes if id is enabled", doesNotDeleteIfEnabled(msgSource));

    it("sets a custom domain", setsCustomDomain(msgSource));

    it("adds an admin", addAdmin(msgSource));

    it("adds a user", addUser(msgSource));

    it("removes a user", removeUser(msgSource));

    it("cannot remove oneself", cannotRemoveOneself(msgSource));
  });
}
