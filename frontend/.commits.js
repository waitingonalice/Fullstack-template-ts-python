const custom = require("@digitalroute/cz-conventional-changelog-for-jira/configurable");
const defaultTypes = require("@digitalroute/cz-conventional-changelog-for-jira/types");

module.exports = custom({
  types: {
    ...defaultTypes,

    change: {
      description: "Changes to an existing feature",
      title: "Change",
    },
    chore: {
      description:
        "Commits that should not show up in the changelog (code review changes)",
      title: "Chore",
    },
  },
  defaultType: "chore",
  skipScope: true,
  jiraPrepend: "[",
  jiraAppend: "]",
});
