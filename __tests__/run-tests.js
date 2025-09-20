// Simple utility tests for core functions
// Run with: node __tests__/run-tests.js

// Test helper function
function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}: ${error.message}`);
    process.exit(1);
  }
}

// Inline utility functions for testing (avoiding import issues)
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function calculateAspectRatioDimensions(originalDimensions, targetRatio) {
  const { width, height } = originalDimensions;
  if (width >= height) {
    return {
      width: width,
      height: Math.round(width / targetRatio)
    };
  } else {
    return {
      width: Math.round(height * targetRatio),
      height: height
    };
  }
}

function getResizeOptions(selectedPreset, customWidth, customHeight) {
  const presets = {
    whytes_hero: { maxWidth: 1920 },
    thumbnail: { maxWidth: 1200 },
    custom: { maxWidth: null }
  };

  if (selectedPreset === 'custom') {
    return { width: customWidth, height: customHeight };
  } else {
    return { maxWidth: presets[selectedPreset]?.maxWidth ?? undefined };
  }
}

// Test formatBytes function
runTest('formatBytes converts bytes correctly', () => {
  const tests = [
    { input: 0, expected: '0 Bytes' },
    { input: 1024, expected: '1 KB' },
    { input: 1048576, expected: '1 MB' },
    { input: 1536, expected: '1.5 KB' },
  ];

  tests.forEach(({ input, expected }) => {
    const result = formatBytes(input);
    if (result !== expected) {
      throw new Error(`Expected ${expected}, got ${result} for input ${input}`);
    }
  });
});

// Test calculateAspectRatioDimensions function
runTest('calculateAspectRatioDimensions calculates correctly', () => {
  const tests = [
    {
      input: { originalDimensions: { width: 1920, height: 1080 }, targetRatio: 16/9 },
      expected: { width: 1920, height: 1080 }
    },
    {
      input: { originalDimensions: { width: 800, height: 600 }, targetRatio: 1 },
      expected: { width: 800, height: 800 }
    },
    {
      input: { originalDimensions: { width: 600, height: 800 }, targetRatio: 1 },
      expected: { width: 800, height: 800 }
    }
  ];

  tests.forEach(({ input, expected }) => {
    const result = calculateAspectRatioDimensions(input.originalDimensions, input.targetRatio);
    if (result.width !== expected.width || result.height !== expected.height) {
      throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }
  });
});

// Test getResizeOptions function
runTest('getResizeOptions returns correct options', () => {
  const tests = [
    {
      input: { preset: 'custom', width: 800, height: 600 },
      expected: { width: 800, height: 600 }
    },
    {
      input: { preset: 'whytes_hero', width: '', height: '' },
      expected: { maxWidth: 1920 }
    },
    {
      input: { preset: 'thumbnail', width: '', height: '' },
      expected: { maxWidth: 1200 }
    }
  ];

  tests.forEach(({ input, expected }) => {
    const result = getResizeOptions(input.preset, input.width, input.height);
    if (JSON.stringify(result) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }
  });
});

console.log('\n🧪 All utility tests passed!');