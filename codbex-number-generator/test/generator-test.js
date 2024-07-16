import { response } from "sdk/http";
import { NumberGeneratorService } from "../service/generator";
response.println("Generated Number: " + new NumberGeneratorService().generate(1));
