import fetch from "node-fetch";
import { Probot } from "probot";

type Response = {
  "1": Array<{
    description: string
    index_end: number
    index_start: number
    language_construct: string
    text: string
    title: string
  }>
}

// const node_fetch_1 = await import("node-fetch");

export = (app: Probot) => {
  app.on(["issues.opened", "issues.edited", "issues.labeled"], async (context) => {

    const issue = context.payload.issue;
    const hasRequirementLabel = issue.labels?.some(label => label.name === "requirement");
    const hasRequirementDebtLabel = issue.labels?.some(label => label.name === "requirement-debt");
    const requirementDescription = issue.body;

    if (hasRequirementLabel && requirementDescription) {
      try {
        const response = await fetch("http://localhost:9799/check-quality", {
          method: 'POST',
          body: JSON.stringify({
            requirements: [{
              id: 1,
              text: requirementDescription
            }]
          })
        }).then(res => res.json()) as Response;

        const report = response[1];

        if (report.length === 0 && hasRequirementDebtLabel) {
          await context.octokit.issues.removeLabel(context.issue({ name: "requirement-debt" }))
        }
        else if (report.length > 0 && (!hasRequirementDebtLabel || context.payload.action === "edited")) {
          const issueComment = context.issue({
            body: `Please, fix the following problems with your requirement description:
            
            ${report.map(problem => (
              ` 
  - ${problem.title} (${problem.language_construct}) 
  ${requirementDescription.slice(0, problem.index_start)}**${problem.text}**${requirementDescription.slice(problem.index_end)}  
  *${problem.description}*
  
              `
            )).join("")}

            `,
          });
          await context.octokit.issues.createComment(issueComment);
          await context.octokit.issues.addLabels(context.issue({
            labels: ['requirement-debt']
          }))
        }

      } catch (error) {
        console.error(error);
      }

    }
    else if (hasRequirementLabel && !hasRequirementDebtLabel) {
      const issueComment = context.issue({
        body: "Please, add a description to this requirement!",
      });
      await context.octokit.issues.createComment(issueComment);
      await context.octokit.issues.addLabels(context.issue({
        labels: ['requirement-debt']
      }))
    }
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
