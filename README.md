# BlendMesh - FlowEditor

**Principais recursos dependentes a serem implementados**

### Lambda Function
- **IAM Role** (obrigatório)
- **VPC** (se VpcConfig for usado)
- **Security Groups** (se VpcConfig for usado)
- **Subnets** (se VpcConfig for usado)
- **S3 Bucket** (se usar Code.S3Bucket)

### S3 Bucket
- **KMS Key** (se usar BucketEncryption com SSE-KMS)
- **IAM Policy** (para acesso ao bucket)

### EC2 Instance
- **VPC**
- **Subnet**
- **Security Groups**
- **IAM Role** (opcional)
- **EBS Volume** (se BlockDeviceMappings for usado)
- **Key Pair** (KeyName)

### VPC
- **Subnet**
- **Internet Gateway** (para acesso público)
- **Route Table**
- **Security Group**

### Subnet
- **VPC**
- **Route Table** (associação)

### RDS DBInstance
- **VPC**
- **Subnet Group**
- **Security Groups**
- **KMS Key** (opcional, para encriptação)
- **Option Group** (opcional)
- **Parameter Group** (opcional)

### Organizations Account
- **Organizational Unit** (opcional)
- **Service Control Policy** (opcional)

