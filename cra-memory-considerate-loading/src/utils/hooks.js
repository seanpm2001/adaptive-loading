/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useEffect } from 'react';

const unsupportMessage = 'The Memory Status API is not supported on this platform.';
const windowPerformance = window.performance;

const MAX_MEMORY_LIMIT = 20 * 1048576; // 20MB
// const MAX_PERCENT_THRESHOLD = 90;

const isMemorySupported = () => {
  return windowPerformance && windowPerformance.memory;
};

const useMemoryStatus = () => {
  const [memoryStatus, setMemoryStatus] = useState(null);

  const getTotalJSHeapSize = () => windowPerformance.memory.totalJSHeapSize;
  const getUsedJSHeapSize = () => windowPerformance.memory.usedJSHeapSize;
  const getJSHeapSizeLimit = () => windowPerformance.memory.jsHeapSizeLimit;

  const getOverUsedMemorySize = () => {
    const usedJSHeapSize = getUsedJSHeapSize();
    const overUsedMemorySize = usedJSHeapSize - MAX_MEMORY_LIMIT;
    return overUsedMemorySize;
  };

  const getUsedMemoryPercent = () => {
    const usedJSHeapSize = getUsedJSHeapSize();
    const jsHeapSizeLimit = getJSHeapSizeLimit();
    const usedMemoryPercent = usedJSHeapSize / jsHeapSizeLimit * 100;
    return usedMemoryPercent;
  };

  useEffect(() => {
    if (isMemorySupported()) {
      setMemoryStatus({
        totalJSHeapSize: getTotalJSHeapSize(),
        usedJSHeapSize: getUsedJSHeapSize(),
        jsHeapSizeLimit: getJSHeapSizeLimit(),
        overUsedMemorySize: getOverUsedMemorySize(),
        usedMemoryPercent: getUsedMemoryPercent()
      });
    } else {
      setMemoryStatus({unsupportMessage});
    }
  // eslint-disable-next-line
  }, []);

  return memoryStatus;
};

export { useMemoryStatus };