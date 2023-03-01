#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { ComputeType, LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { addTags } from '../lib/add-tags';

const app = new cdk.App();

const buildEnvironment = {
	region: 'eu-west-1',
	account: '871895356291'
};

const stack = new PipelineStack(app, 'freemium-design-tokens-ci-stack', {
	env: buildEnvironment,
	codestarArn: `arn:aws:codestar-connections:eu-west-1:${buildEnvironment.account}:connection/d4d435c6-2fbb-4100-bea6-560bbec6153b`,
	applicationName: 'freemium-design-tokens',
	repositoryOwner: 'persgroep',
	repositoryName: 'design-tokens-freemium',
	branchName: 'main',
	sshRepositoryUrl: 'git@bitbucket.org:persgroep/design-tokens-freemium.git',
	computeType: ComputeType.SMALL,
	buildImage: LinuxBuildImage.STANDARD_6_0
});

addTags(stack, 'freemium-design-tokens', 'prod', 'team010');
