type HTMLElementConstructor<T extends HTMLElement> = abstract new (...args: never[]) => T;

export function getRequiredElementById<T extends HTMLElement>(
  id: string,
  expectedType: HTMLElementConstructor<T>,
): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required DOM element: #${id}`);
  }

  if (!(element instanceof expectedType)) {
    throw new Error(
      `Invalid DOM element type for #${id}. Expected ${expectedType.name}, got ${element.constructor.name}.`,
    );
  }

  return element;
}
