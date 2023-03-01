import type { Stack } from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';

export const addTags = (stack: Stack, applicationName: string, environmentName: string, squad: string) => {
  Tags.of(stack).add('Application', applicationName, {
    applyToLaunchedInstances: true,
    priority: 100,
    includeResourceTypes: []
  });
  Tags.of(stack)
    .add('Stage', environmentName.toUpperCase(), {
      applyToLaunchedInstances: true,
      priority: 100,
      includeResourceTypes: []
    });
  Tags.of(stack)
    .add('Squad', squad, {
      applyToLaunchedInstances: true,
      priority: 100,
      includeResourceTypes: []
    });
};
