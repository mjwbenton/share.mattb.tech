import path from "path";
import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_route53 as route53,
  aws_route53_targets as route53targets,
  aws_cloudfront as cloudfront,
  aws_certificatemanager as acm,
  aws_s3_deployment as s3deploy,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
} from "aws-cdk-lib";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import { env } from "./env";

export type StaticWebsiteProps = cdk.StackProps & {
  domainName: string;
  hostedZoneId: string;
  zoneName: string;
  outPath: string;
  enableSSOAuthentication: boolean;
};

export class StaticWebsite extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id, props);
    const { domainName, hostedZoneId, zoneName, outPath } = props;

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId,
        zoneName,
      },
    );

    const pagesBucket = new s3.Bucket(this, "PagesBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });
    const assetsBucket = new s3.Bucket(this, "AssetsBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    const certificate = new acm.Certificate(this, "Certificate", {
      domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const routerLambda = new lambda.Function(this, "RouterFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "dist/index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../edge-router")),
    });

    const authLambda = new lambda_nodejs.NodejsFunction(this, "AuthFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../../edge-auth/dist/index.js"),
      handler: "handler",
      bundling: {
        target: "es2020",
        environment: {
          NODE_ENV: "production",
        },
        define: {
          "process.env.COGNITO_USER_POOL_ID": JSON.stringify(
            env.COGNITO_USER_POOL_ID,
          ),
          "process.env.COGNITO_CLIENT_ID": JSON.stringify(
            env.COGNITO_CLIENT_ID,
          ),
          "process.env.COGNITO_DOMAIN": JSON.stringify(env.COGNITO_DOMAIN),
        },
      },
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(pagesBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            functionVersion: routerLambda.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          },
          ...(props.enableSSOAuthentication
            ? [
                {
                  functionVersion: authLambda.currentVersion,
                  eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                },
              ]
            : []),
        ],
      },
      domainNames: [domainName],
      certificate,
    });
    distribution.addBehavior(
      "_next/*",
      origins.S3BucketOrigin.withOriginAccessControl(assetsBucket),
      {
        edgeLambdas: [
          ...(props.enableSSOAuthentication
            ? [
                {
                  functionVersion: authLambda.currentVersion,
                  eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
                },
              ]
            : []),
        ],
      },
    );

    new s3deploy.BucketDeployment(this, "DeployPages", {
      sources: [
        s3deploy.Source.asset(outPath, {
          exclude: ["_next"],
        }),
      ],
      destinationBucket: pagesBucket,
      cacheControl: [
        s3deploy.CacheControl.fromString(
          "max-age=0,no-cache,no-store,must-revalidate",
        ),
      ],
      distribution,
      memoryLimit: 1024,
    });

    new s3deploy.BucketDeployment(this, "DeployAssets", {
      sources: [
        s3deploy.Source.asset(outPath, {
          exclude: ["*.html"],
        }),
      ],
      destinationBucket: assetsBucket,
      cacheControl: [
        s3deploy.CacheControl.fromString("max-age=31536000,public,immutable"),
      ],
      distribution,
      prune: false,
      memoryLimit: 1024,
    });

    new route53.ARecord(this, "DomainRecord", {
      zone: hostedZone,
      recordName: domainName,
      ttl: cdk.Duration.minutes(5),
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution),
      ),
    });
  }
}
