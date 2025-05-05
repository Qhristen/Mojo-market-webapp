import { renderJavaScriptVisitor, renderJavaScriptUmiVisitor } from '@codama/renderers';
import { createFromRoot, RootNode } from 'codama';
import codamaIDL from './idl/codama.json'
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const codama = createFromRoot(codamaIDL as unknown as RootNode);

const folderPath = join(process.cwd(), 'src', 'generated', 'ts');

if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }

  codama.accept(renderJavaScriptVisitor(folderPath, {formatCode: true}));
  // codama.accept(renderJavaScriptUmiVisitor(folderPath, {}));

  console.log("->>>>>>>>>>>>>>>>>>>>> code generation complete.")
