<script lang="ts">
    import { selected_generator } from '../../../stores/demonstration';
</script>

<div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium">
            Generator { $selected_generator.generator.name }
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details
        </p>
    </div>
    <div class="border-t border-gray-200">
        <dl>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                    Type
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { $selected_generator.generator.type }
                </dd>
                
                <dt class="text-sm font-medium text-gray-500">
                    Developed by:
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { $selected_generator.generator.developed_by }
                </dd>
            </div>
        </dl>
    </div>
</div>
