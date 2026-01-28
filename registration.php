<?php
/**
 * Copyright © 2026 Modestox (https://github.com/modestox). All rights reserved.
 * License: MIT
 */

declare(strict_types=1);

use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Modestox_DashboardExtension',
    __DIR__,
);
