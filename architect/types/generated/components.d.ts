import type { Schema, Struct } from '@strapi/strapi';

export interface ServiceSpecializeServiceBox extends Struct.ComponentSchema {
  collectionName: 'components_service_specialize_service_boxes';
  info: {
    displayName: 'specialize-service-box';
    icon: '';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    service_description: Schema.Attribute.Blocks;
    service_name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'service.specialize-service-box': ServiceSpecializeServiceBox;
    }
  }
}
