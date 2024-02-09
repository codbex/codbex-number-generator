import { response } from "sdk/http";
import { NumberGeneratorService } from "../service/generator";

response.println("Hello World! " + new NumberGeneratorService().generate(1));