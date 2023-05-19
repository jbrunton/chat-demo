import { faker } from '@faker-js/faker';
import {
  LoremGenerator,
  LoremGeneratorParams,
  LoremType,
} from '@usecases/commands/lorem';

export class FakerLoremGenerator extends LoremGenerator {
  generate({ typeToken, count }: LoremGeneratorParams): string {
    const loremType = typeToken as LoremType;
    return faker.lorem[loremType](count);
  }
}
