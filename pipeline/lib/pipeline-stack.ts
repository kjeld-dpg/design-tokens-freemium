import * as cdk from 'aws-cdk-lib';
import type { Environment, StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import type { ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import {
  CodeBuildAction,
  CodeStarConnectionsSourceAction
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import type { IBuildImage } from 'aws-cdk-lib/aws-codebuild/lib/project';

export type PipelineStackProps = {
	readonly env: Required<Environment>;
	readonly repositoryName: string;
	readonly repositoryOwner: string;
	readonly codestarArn: string;
	readonly branchName: string;
	readonly applicationName: string;
	readonly sshRepositoryUrl: string;
	readonly computeType: ComputeType;
	readonly buildImage: IBuildImage;
} & StackProps

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const codepipeline = new Pipeline(this, 'Pipeline', {
      pipelineName: `${props.applicationName}-delivery`,
      crossAccountKeys: false,
      artifactBucket: Bucket.fromBucketArn(
        this,
        'S3ArtifactsBucket',
        'arn:aws:s3:::dpg-artifacts-871895356291-eu-west-1-cfn'
      )
    });

    const sourceOutput = new Artifact();
    const sourceAction = new CodeStarConnectionsSourceAction({
      actionName: 'BitBucket',
      branch: props.branchName,
      owner: props.repositoryOwner,
      repo: props.repositoryName,
      output: sourceOutput,
      connectionArn: props.codestarArn,
      codeBuildCloneOutput: true
    });

    codepipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    });

    const project = new PipelineProject(
      this,
      `${props.applicationName}-build`,
      {
        projectName: `${props.applicationName}-build-cfn`,
        environment: {
          buildImage: props.buildImage,
          computeType: props.computeType
        },
        environmentVariables: {
          GIT_REPOSITORY_ID: {
            value: `${props.repositoryOwner}/${props.repositoryName}`
          },
          REPOSITORY_FULL_NAME: {
            value: `${props.repositoryOwner}/${props.repositoryName}`
          },
          REPORT_BUILD_STATUS: {
            value: 'true'
          },
          SSH_REPO_URL: {
            value: props.sshRepositoryUrl
          }
        }
      }
    );

    Bucket.fromBucketArn(
      this,
      'PopularCodebuildLibraryBucket',
      'arn:aws:s3:::popular-codebuild-library'
    ).grantReadWrite(project.grantPrincipal);

    project.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'ssm:GetParameter',
          'ssm:GetParameters',
          'ssm:GetParametersByPath'
        ],
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:ssm:${props.env.region}:${props.env.account}:parameter/all/codebuild/*`,
          `arn:aws:ssm::${props.env.region}:${props.env.account}:parameter/all/codebuild/project/${project.projectName}/*`
        ]
      })
    );

    project.addToRolePolicy(
      new PolicyStatement({
        actions: ['kms:Decrypt'],
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:kms:${props.env.region}:${props.env.account}:key/e044c8d9-a72c-4d88-82e1-ba90b367bb90`
        ]
      })
    );

    const buildArtifact = new Artifact();
    const buildAction = new CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [buildArtifact],
      environmentVariables: {
        GIT_BRANCH: {
          value: props.branchName
        }
      }
    });

    codepipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    });
  }
}
