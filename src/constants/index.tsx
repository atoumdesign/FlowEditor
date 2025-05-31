


enum Architectures {
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

// --- EC2 Instance ---
export interface EC2InstanceProperties {
    InstanceId?: string;
    InstanceType: string;
    AmiId: string;
    KeyName?: string;
    SubnetId?: string;
    SecurityGroupIds?: string[];
    Tags?: Record<string, string>;
}

export const defaultEC2InstanceProperties: EC2InstanceProperties = {
    InstanceType: "t3.micro",
    AmiId: "",
    KeyName: "",
    SubnetId: "",
    SecurityGroupIds: [],
    Tags: {},
};

// --- S3 Bucket ---
export interface S3BucketProperties {
    BucketName: string;
    Versioning?: boolean;
    Encryption?: boolean;
    Tags?: Record<string, string>;
}

export const defaultS3BucketProperties: S3BucketProperties = {
    BucketName: "my-bucket",
    Versioning: false,
    Encryption: false,
    Tags: {},
};

// --- RDS MySQL Instance ---
export interface RDSMySQLInstanceProperties {
    DBInstanceIdentifier: string;
    DBInstanceClass: string;
    Engine: "mysql";
    EngineVersion?: string;
    MasterUsername: string;
    MasterUserPassword?: string;
    AllocatedStorage: number;
    VpcSecurityGroupIds?: string[];
    DBSubnetGroupName?: string;
    Tags?: Record<string, string>;
}

export const defaultRDSMySQLInstanceProperties: RDSMySQLInstanceProperties = {
    DBInstanceIdentifier: "mysql-instance",
    DBInstanceClass: "db.t3.micro",
    Engine: "mysql",
    EngineVersion: "8.0",
    MasterUsername: "admin",
    MasterUserPassword: "",
    AllocatedStorage: 20,
    VpcSecurityGroupIds: [],
    DBSubnetGroupName: "",
    Tags: {},
};

// --- RDS MariaDB Instance ---
export interface RDSMariaDBInstanceProperties {
    DBInstanceIdentifier: string;
    DBInstanceClass: string;
    Engine: "mariadb";
    EngineVersion?: string;
    MasterUsername: string;
    MasterUserPassword?: string;
    AllocatedStorage: number;
    VpcSecurityGroupIds?: string[];
    DBSubnetGroupName?: string;
    Tags?: Record<string, string>;
}

export const defaultRDSMariaDBInstanceProperties: RDSMariaDBInstanceProperties = {
    DBInstanceIdentifier: "mariadb-instance",
    DBInstanceClass: "db.t3.micro",
    Engine: "mariadb",
    EngineVersion: "10.6",
    MasterUsername: "admin",
    MasterUserPassword: "",
    AllocatedStorage: 20,
    VpcSecurityGroupIds: [],
    DBSubnetGroupName: "",
    Tags: {},
};

// --- RDS PostgreSQL Instance ---
export interface RDSPostgresInstanceProperties {
    DBInstanceIdentifier: string;
    DBInstanceClass: string;
    Engine: "postgres";
    EngineVersion?: string;
    MasterUsername: string;
    MasterUserPassword?: string;
    AllocatedStorage: number;
    VpcSecurityGroupIds?: string[];
    DBSubnetGroupName?: string;
    Tags?: Record<string, string>;
}

export const defaultRDSPostgresInstanceProperties: RDSPostgresInstanceProperties = {
    DBInstanceIdentifier: "postgres-instance",
    DBInstanceClass: "db.t3.micro",
    Engine: "postgres",
    EngineVersion: "15",
    MasterUsername: "admin",
    MasterUserPassword: "",
    AllocatedStorage: 20,
    VpcSecurityGroupIds: [],
    DBSubnetGroupName: "",
    Tags: {},
};

// --- VPC ---
export interface VPCProperties {
    VpcId?: string;
    CidrBlock: string;
    EnableDnsSupport?: boolean;
    EnableDnsHostnames?: boolean;
    Tags?: Record<string, string>;
}

export const defaultVPCProperties: VPCProperties = {
    VpcId: "",
    CidrBlock: "10.0.0.0/16",
    EnableDnsSupport: true,
    EnableDnsHostnames: true,
    Tags: {},
};

// --- Account ---
export interface AccountProperties {
    AccountId: string;
    AccountName?: string;
    Email?: string;
}

export const defaultAccountProperties: AccountProperties = {
    AccountId: "",
    AccountName: "",
    Email: "",
};

// --- Private Subnet ---
export interface PrivateSubnetProperties {
    SubnetId?: string;
    VpcId?: string;
    CidrBlock: string;
    AvailabilityZone?: string;
    Tags?: Record<string, string>;
}

export const defaultPrivateSubnetProperties: PrivateSubnetProperties = {
    SubnetId: "",
    VpcId: "",
    CidrBlock: "10.0.1.0/24",
    AvailabilityZone: "",
    Tags: {},
};

// --- Public Subnet ---
export interface PublicSubnetProperties {
    SubnetId?: string;
    VpcId?: string;
    CidrBlock: string;
    AvailabilityZone?: string;
    MapPublicIpOnLaunch?: boolean;
    Tags?: Record<string, string>;
}

export const defaultPublicSubnetProperties: PublicSubnetProperties = {
    SubnetId: "",
    VpcId: "",
    CidrBlock: "10.0.2.0/24",
    AvailabilityZone: "",
    MapPublicIpOnLaunch: true,
    Tags: {},
};


// Exemplo de estrutura no arquivo de constantes (constants/index.tsx):

export const predefinedModels = {
  exemplo1: {
    nodes: [
    {
    id: 'account',
    type: 'account',
    data: { label: 'account' },
    position: { x: 0, y: 0 },
    style: {
      width: 1000,
      height: 500,
    },
  },
    {
    id: 'vpc',
    type: 'vpc',
    data: { label: 'vpc' },
    position: { x: 40, y: 40 },
    style: {
      width: 800,
      height: 450,
    },
    parentId: 'account',
    extent: 'parent',
  },
      {
    id: 'subnetprivate',
    type: 'subnetprivate',
    data: { label: 'subnet privada' },
    position: { x: 40, y: 40 },
    style: {
      width: 350,
      height: 400,
    },
    parentId: 'vpc',
    extent: 'parent',
  },
        {
    id: 'subnetpublic',
    type: 'subnetpublic',
    data: { label: 'subnet pública' },
    position: { x: 420, y: 40 },
    style: {
      width: 350,
      height: 400,
    },
    parentId: 'vpc',
    extent: 'parent',
  },

  {
    id: 'B',
    type: 'instance',
    data: { label: 'instance node 1' },
    position: { x: 40, y: 40 },
    parentId: 'subnetprivate',
    extent: 'parent',
  },
  {
    id: 'C',
    type: 'instance',
    data: { label: 'instance node 2' },
    position: { x: 40, y: 40 },
    parentId: 'subnetpublic',
    extent: 'parent',
  },
  ],
  edges: [],
  },
  exemplo2: {
    nodes: [  ],
    edges: [  ]
  }
};