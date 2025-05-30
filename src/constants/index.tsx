enum Architectures  {
    X86 = "x86_64",
    ARM = "arm64",
}

enum Runtime {
    NODE22 = "nodejs22.x",
    NODE20 = "nodejs20.x",
    NODE18 = "nodejs18.x",
    PYTHON313 = "python3.13",
    PYTHON312 = "python3.12",
    PYTHON311 = "python3.11",
    PYTHON310 = "python3.10",
    PYTHON39 = "python3.9",
    JAVA21 = "java21",
    JAVA17 = "java17",
    JAVA11 = "java11",
    JAVA8 = "java8.al2",
    DOTNET9 = "dotnet9",
    DOTNET8 = "dotnet8",
    RUBI34 = "ruby3.4",
    RUBI33 = "ruby3.3",
    RUBI32 = "ruby3.2",
    AL2023 = "provided.al2023",
    AL2 = "provided.al2",
}

interface Code {
    S3Bucket?: string;
    S3Key?: string;
    S3ObjectVersion?: string;
    ZipFile?: string;
}

interface Environment {
    Variables: Record<string, string>;
}

interface FileSystemConfig {
    Arn: string;
    LocalMountPath: string;
}

interface TracingConfig {
    Mode: "Active" | "PassThrough";
}

interface VpcConfig {
    SecurityGroupIds: string[];
    SubnetIds: string[];
}


interface LambdaProperties {
    Architectures?: Architectures;
    FunctionName: string;
    Runtime: Runtime;
    Role: string;
    MemorySize?: number;
    Timeout?: number;
    Environment?: Record<string, string>;
    Tags?: Record<string, string>;
}

export const defaultLambdaProperties: LambdaProperties = {
  FunctionName: "MyLambda",
  Runtime: Runtime.NODE22,
  Role: "",
  MemorySize: 128,
  Timeout: 3,
};