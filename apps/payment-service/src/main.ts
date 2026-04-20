import { bootstrapHttpService } from '@ecommerce/common-bootstrap';
import { AppModule } from './app.module';

void bootstrapHttpService(AppModule, 'payment-service', { rawBody: true });
