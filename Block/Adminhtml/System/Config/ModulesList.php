<?php
/**
 * Copyright © 2026 Modestox (https://github.com/modestox). All rights reserved.
 * License: MIT
 */

declare(strict_types=1);

namespace Modestox\DashboardExtension\Block\Adminhtml\System\Config;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;
use Magento\Config\Model\Config\Structure;
use Magento\Backend\Block\Template\Context;

/**
 * Class ModulesList
 * Renders the custom dashboard grid with search functionality in System Configuration
 */
class ModulesList extends Field
{
    /**
     * @var Structure
     */
    protected $configStructure;

    /**
     * @param Context $context
     * @param Structure $configStructure
     * @param array $data
     */
    public function __construct(
        Context $context,
        Structure $configStructure,
        array $data = []
    ) {
        $this->configStructure = $configStructure;
        parent::__construct($context, $data);
    }

    /**
     * Set custom classes and hide labels for the row
     *
     * @param AbstractElement $element
     * @return string
     */
    public function render(AbstractElement $element)
    {
        // Add custom class for CSS targeting
        $element->addClass('modestox-dashboard-field');
        $element->setLabel('');
        $element->setCanUseDefaultValue(false);
        $element->setCanUseWebsiteValue(false);

        return parent::render($element);
    }

    /**
     * Generate HTML for the dashboard grid with searchable groups and collapsible lists
     *
     * @param AbstractElement $element
     * @return string
     */
    protected function _getElementHtml(AbstractElement $element)
    {
        $excludeSections = ['modestox_dashboard_extension'];
        $tabs = $this->configStructure->getTabs();

        $html = '<div class="modestox-dashboard-wrapper">';

        $html .= '
            <div class="modestox-search-container">
                <div class="search-input-wrapper">
                    <input type="text" id="modestox-config-search"
                           placeholder="' . __("Search by section or group...") . '"
                           autocomplete="off"
                           spellcheck="false">
                    <button type="button" id="modestox-search-clear" class="action-clear"></button>
                </div>
            </div>';

        $html .= '<div id="modestox-main-grid" class="modestox-grid-container">';

        foreach ($tabs as $tab) {
            $sections = $tab->getChildren();
            $sectionItemsHtml = '';

            foreach ($sections as $section) {
                $sectionId = $section->getId();
                $label = $section->getLabel();

                if (!$label || in_array($sectionId, $excludeSections)) {
                    continue;
                }

                /** Collect Group labels and correct IDs for anchors */
                $groupData = [];
                $groupNamesForSearch = [];
                foreach ($section->getChildren() as $group) {
                    $gLabel = (string)$group->getLabel();
                    if ($gLabel) {
                        /**
                         * FIX: We MUST combine sectionId and groupId
                         * to match Magento head IDs (e.g., 'general_country')
                         */
                        $fullGroupId = $sectionId . '_' . $group->getId();

                        $groupData[] = [
                            'id' => $fullGroupId,
                            'label' => $gLabel
                        ];
                        $groupNamesForSearch[] = $gLabel;
                    }
                }

                $searchTerm = strtolower($label . ' ' . $sectionId . ' ' . implode(' ', $groupNamesForSearch));

                $groupsListHtml = '';
                $toggleHtml = '';
                if (!empty($groupData)) {
                    $groupsListHtml = '<div class="m2-card-groups-wrapper" style="display:none;">';
                    $groupsListHtml .= '<ul class="m2-card-groups-list">';
                    foreach ($groupData as $g) {
                        $groupsListHtml .= '<li class="m2-group-link" data-group-id="' . $g['id'] . '">' . $g['label'] . '</li>';
                    }
                    $groupsListHtml .= '</ul></div>';
                    $toggleHtml = '<div class="m2-card-toggle"></div>';
                }

                $url = $this->getUrl('adminhtml/system_config/edit', ['section' => $sectionId]);

                $sectionItemsHtml .= "
                <div class='m2-config-card-container' data-search-term='{$searchTerm}'>
                    <div class='m2-card-main-row'>
                        <a href='{$url}' class='m2-config-card'>
                            <span class='m2-card-label'>{$label}</span>
                            <code class='m2-card-id-code'>{$sectionId}</code>
                        </a>
                        {$toggleHtml}
                    </div>
                    {$groupsListHtml}
                </div>";
            }

            if ($sectionItemsHtml) {
                $html .= "<div class='m2-tab-group'>
                            <h3 class='m2-tab-title'>{$tab->getLabel()}</h3>
                            <div class='m2-grid-layout'>{$sectionItemsHtml}</div>
                          </div>";
            }
        }

        $html .= '</div>
            <div id="modestox-no-results" style="display:none;">
                <span class="icon">🔍</span>
                <p>' . __("Nothing found for your request") . '</p>
            </div>';

        $html .= '</div>';

        return $html;
    }
}
