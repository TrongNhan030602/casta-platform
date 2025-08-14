<?php

namespace App\Providers;


// Models
use App\Models\Tag;
use App\Models\Post;
use App\Models\User;
use App\Models\Media;
use App\Models\Product;
use App\Models\Service;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Feedback;
use App\Models\LoginLog;
use App\Models\Violation;
use App\Models\Enterprise;
use App\Models\NewsCategory;
use App\Models\RentalContract;
use App\Models\ExhibitionSpaceProduct;
use App\Models\ExhibitionMedia;
use App\Models\ExhibitionSpaceCategory;
use App\Models\ExhibitionSpace;
use App\Models\ServiceCategory;

// Policies
use App\Policies\PostPolicy;
use App\Policies\UserPolicy;
use App\Policies\MediaPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ServicePolicy;
use App\Policies\TagPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\FeedbackPolicy;
use App\Policies\LoginLogPolicy;
use App\Policies\ViolationPolicy;
use App\Policies\EnterprisePolicy;
use App\Policies\NewsCategoryPolicy;
use App\Policies\RentalContractPolicy;
use App\Policies\ExhibitionMediaPolicy;
use App\Policies\ExhibitionSpacePolicy;
use App\Policies\ServiceCategoryPolicy;
use App\Policies\ExhibitionSpaceProductPolicy;
use App\Policies\ExhibitionSpaceCategoryPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        LoginLog::class => LoginLogPolicy::class,
        Enterprise::class => EnterprisePolicy::class,
        Customer::class => CustomerPolicy::class,
        Violation::class => ViolationPolicy::class,
        ExhibitionSpace::class => ExhibitionSpacePolicy::class,
        ExhibitionMedia::class => ExhibitionMediaPolicy::class,
        RentalContract::class => RentalContractPolicy::class,
        ExhibitionSpaceCategory::class => ExhibitionSpaceCategoryPolicy::class,
        ExhibitionSpaceProduct::class => ExhibitionSpaceProductPolicy::class,
        Feedback::class => FeedbackPolicy::class,
        Category::class => CategoryPolicy::class,
        Product::class => ProductPolicy::class,
        NewsCategory::class => NewsCategoryPolicy::class,
        ServiceCategory::class => ServiceCategoryPolicy::class,
        Post::class => PostPolicy::class,
        Service::class => ServicePolicy::class,
        Tag::class => TagPolicy::class,
        Media::class => MediaPolicy::class,

    ];

    public function boot(): void
    {
        //
    }
}