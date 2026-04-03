// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Chart.js canvas context for JSDOM environment
class MockCanvasRenderingContext2D {
  fillRect() {}
  clearRect() {}
  getImageData() {
    return { data: new Array(4) };
  }
  putImageData() {}
  createImageData() {
    return { data: new Array(4) };
  }
  setTransform() {}
  drawImage() {}
  save() {}
  fillText() {}
  restore() {}
  beginPath() {}
  moveTo() {}
  lineTo() {}
  closePath() {}
  stroke() {}
  translate() {}
  scale() {}
  rotate() {}
  arc() {}
  fill() {}
  measureText() {
    return { width: 0 };
  }
  transform() {}
  rect() {}
  clip() {}
}

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextType) => {
  if (contextType === '2d') {
    return new MockCanvasRenderingContext2D();
  }
  return null;
});

// Mock toDataURL method
HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,mock');
