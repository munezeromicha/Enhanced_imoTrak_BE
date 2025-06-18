import dotenv from 'dotenv';

dotenv.config();

interface EnvVar {
    name: string;
    required: boolean;
    description: string;
}

const requiredEnvVars: EnvVar[] = [
    { name: 'DATABASE_URL', required: true, description: 'PostgreSQL database connection string' },
    { name: 'JWT_SECRET', required: true, description: 'Secret key for JWT token signing' },
    { name: 'MAIL_USER', required: false, description: 'Email address for sending notifications' },
    { name: 'MAIL_PASS', required: false, description: 'Email password or app password' },
    { name: 'MAIL_SERVICE', required: false, description: 'Email service provider (gmail, outlook, etc.)' },
    { name: 'SUPERADMIN_EMAIL', required: false, description: 'Super admin email address' },
    { name: 'SUPERADMIN_PASSWORD', required: false, description: 'Super admin password' },
];

export const checkEnvironmentVariables = () => {
    console.log('\n🔍 Environment Variables Check:');
    console.log('================================');
    
    const missing: string[] = [];
    const warnings: string[] = [];
    
    requiredEnvVars.forEach(envVar => {
        const value = process.env[envVar.name];
        if (envVar.required && !value) {
            missing.push(envVar.name);
            console.log(`❌ ${envVar.name}: MISSING (Required)`);
        } else if (!envVar.required && !value) {
            warnings.push(envVar.name);
            console.log(`⚠️  ${envVar.name}: NOT SET (Optional)`);
        } else {
            console.log(`✅ ${envVar.name}: SET`);
        }
    });
    
    if (missing.length > 0) {
        console.log('\n❌ CRITICAL: Missing required environment variables:');
        missing.forEach(name => {
            const envVar = requiredEnvVars.find(v => v.name === name);
            console.log(`   - ${name}: ${envVar?.description}`);
        });
        console.log('\nPlease set these environment variables in your .env file');
        return false;
    }
    
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNING: Some optional environment variables are not set:');
        warnings.forEach(name => {
            const envVar = requiredEnvVars.find(v => v.name === name);
            console.log(`   - ${name}: ${envVar?.description}`);
        });
        console.log('\nThese are optional but recommended for full functionality');
    }
    
    console.log('\n✅ Environment check completed');
    return true;
}; 